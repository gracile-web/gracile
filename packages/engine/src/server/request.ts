import { Readable } from 'node:stream';

import { logger } from '@gracile/internal-utils/logger';
// import { logger } from '@gracile/internal-utils/logger/vite-logger';
import c from 'picocolors';
import type { ErrorPayload, ViteDevServer } from 'vite';

import * as assert from '../assertions.js';
import { errorPage } from '../errors/templates.js';
import { renderRouteTemplate } from '../render/route-template.js';
import { renderLitTemplate } from '../render/utils.js';
import { getRoute } from '../routes/match.js';
import type * as R from '../routes/route.js';
import type { GracileConfig } from '../user-config.js';

// type NextFunction = (error?: unknown) => void | Promise<void>;

type StandardResponse = { response: Response; body?: never; init?: never };
type ResponseWithNodeReadable = {
	response?: never;
	body: Readable;
	init: ResponseInit;
};

/**
 * The underlying handler interface that you can use to build your own adapter.
 */
export type GracileHandler = (
	request: Request,
	locals?: unknown,
) => Promise<StandardResponse | ResponseWithNodeReadable | null>;

const CONTENT_TYPE_HTML = { 'Content-Type': 'text/html' };

export function isRedirect(response: Response): { location: string } | null {
	const location = response.headers.get('location');
	if (response.status >= 300 && response.status <= 303 && location) {
		return { location };
	}

	return null;
}

export function createGracileHandler({
	vite,
	routes,
	routeImports,
	routeAssets,
	root,
	serverMode,
	gracileConfig,
}: {
	vite?: ViteDevServer | undefined;
	routes: R.RoutesManifest;
	routeImports?: R.RoutesImports | undefined;
	routeAssets?: R.RoutesAssets;
	root: string;
	serverMode?: boolean | undefined;
	gracileConfig: GracileConfig;
}) {
	async function createErrorPage(urlPath: string, e: Error) {
		logger.error(e.message);

		let errorPageHtml = await renderLitTemplate(errorPage(e));
		if (vite)
			errorPageHtml = await vite.transformIndexHtml(urlPath, errorPageHtml);

		return { errorPageHtml, headers: { ...CONTENT_TYPE_HTML } };
	}

	const middleware: GracileHandler = async (request, locals) => {
		try {
			const { url: requestedUrl, method } = request;

			// MARK: Rewrite hidden route siblings
			const fullUrl = requestedUrl.replace(/\/__(.*)$/, '/');

			// MARK: Get route infos

			const exposePremises = gracileConfig.pages?.premises?.expose
				? {
						propsOnly: /\/__(.*?)\.props\.json$/.test(requestedUrl),
						docOnly: /\/__(.*?)\.doc\.html$/.test(requestedUrl),
					}
				: null;

			const routeOptions = {
				url: fullUrl,
				vite,
				routes,
				routeImports,
			};

			const routeInfos = await getRoute(routeOptions).catch(async (error) => {
				// MARK: User defined Gracile 404 rewriting
				logger.error(String(error));
				const url = new URL('/404/', fullUrl).href;
				const options = { ...routeOptions, url };
				const notFound = await getRoute(options).catch((err) => err as Error);
				return notFound;
			});

			if (routeInfos instanceof Error) {
				// MARK: Default, fallback 404
				// const message = `404 not found!\n\n---\n\nCreate a /src/routes/404.{js,ts} to get a custom page.\n${method} - ${fullUrl}`;

				const { errorPageHtml, headers } = await createErrorPage(
					fullUrl,
					routeInfos,
				);
				return {
					response: new Response(errorPageHtml, {
						headers,
						status: 404,
						statusText: '404 not found!',
					}),
				};
			}

			const routeTemplateOptions = {
				url: fullUrl,
				vite,
				mode: 'dev', // vite && vite.config.mode === 'dev' ? 'dev' : 'build',
				routeAssets,
				root,
				serverMode,
				routeInfos,
				docOnly: exposePremises?.docOnly,
			} satisfies Parameters<typeof renderRouteTemplate>[0];

			logger.info(`[${c.yellow(method)}] ${c.yellow(fullUrl)}`, {
				timestamp: true,
			});

			let output: Readable | Response | null;

			let providedLocals: assert.UnknownObject = {};
			if (locals && assert.isUnknownObject(locals)) providedLocals = locals;

			// MARK: Server handler

			const handler = routeInfos.routeModule.handler;

			const responseInit: ResponseInit = {};

			if (
				('handler' in routeInfos.routeModule &&
					typeof handler !== 'undefined') ||
				// TODO: Explain this condition
				(handler && 'GET' in handler === false && method !== 'GET')
			) {
				const routeContext = Object.freeze({
					request,
					url: new URL(fullUrl),
					responseInit,
					params: routeInfos.params,
					locals: providedLocals,
				});

				// MARK: Run user middleware

				// NOTE: Experimental
				// eslint-disable-next-line no-inner-declarations
				// async function useHandler() {}
				// if (vite) {
				// 	const middleware = await vite
				// 		.ssrLoadModule('/src/middleware.ts')
				// 		.catch(() => null)
				// 		.then((m) => m.default);

				// 	if (middleware)
				// 		await middleware(
				// 			routeContext,
				// 			async () => {
				// 				await useHandler();
				// 			},
				// 		);
				// 	else await useHandler();
				// } else {
				// 	await useHandler();
				// }
				//
				// MARK: Handler(s)

				const hasTopLevelHandler = typeof handler === 'function';

				if (hasTopLevelHandler || method in handler) {
					const handlerWithMethod = hasTopLevelHandler
						? handler
						: handler[method as keyof typeof handler];
					if (typeof handlerWithMethod !== 'function')
						throw TypeError('Handler must be a function.');

					const handlerOutput = await Promise.resolve(
						handlerWithMethod(routeContext) as unknown,
					);

					if (assert.isResponseOrPatchedResponse(handlerOutput))
						output = handlerOutput;
					else {
						routeTemplateOptions.routeInfos.props = hasTopLevelHandler
							? handlerOutput
							: { [method]: handlerOutput };

						if (exposePremises?.docOnly) {
							const { document } =
								await renderRouteTemplate(routeTemplateOptions);
							return {
								response: new Response(document, {
									headers: { ...CONTENT_TYPE_HTML },
								}),
							};
						}
						if (exposePremises?.propsOnly)
							return {
								response: Response.json(routeTemplateOptions.routeInfos.props),
							};

						output = await renderRouteTemplate(routeTemplateOptions).then(
							(r) => r.output,
						);
					}

					// MARK: No GET, render page
				} else {
					const statusText = `This route doesn't handle the \`${method}\` method!`;
					return {
						response: new Response(statusText, { status: 405, statusText }),
					};
				}
			} else {
				if (exposePremises?.docOnly) {
					const { document } = await renderRouteTemplate(routeTemplateOptions);
					return {
						response: new Response(document, {
							headers: { ...CONTENT_TYPE_HTML },
						}),
					};
				}
				if (exposePremises?.propsOnly)
					return {
						response: Response.json(
							routeTemplateOptions.routeInfos.props || {},
						),
					};

				output = await renderRouteTemplate(routeTemplateOptions).then(
					(r) => r.output,
				);
			}

			// MARK: Return response

			// NOTE: try directly with the requestPonyfill. This might not be necessary
			if (assert.isResponseOrPatchedResponse(output)) {
				const redirect = isRedirect(output);
				if (redirect?.location)
					return {
						response: Response.redirect(redirect.location, output.status),
					};

				return { response: output };

				// MARK: Stream page render
			}

			// MARK: Page stream error

			if (output instanceof Readable) {
				responseInit.headers = {
					...responseInit.headers,
					...CONTENT_TYPE_HTML,
				};
				return {
					body: output.on('error', (error) => {
						// NOTE: I think it's not usable here
						// if (vite) vite.ssrFixStacktrace(error);

						const errorMessage =
							`[SSR Error] There was an error while rendering a template chunk on server-side.\n` +
							`It was omitted from the resulting HTML.\n`;

						if (vite) {
							logger.error(errorMessage + error.stack);
							const payload = {
								type: 'error',
								err: {
									message: errorMessage,
									stack: error.stack ?? '',
									plugin: 'gracile',

									// NOTE: Other options seems to be unused by the overlay
								},
							} satisfies ErrorPayload;
							setTimeout(() => {
								vite.hot.send(payload);
								// NOTE: Arbitrary value. Lower seems to be too fast, higher is not guaranteed to work.
							}, 750);
						} else {
							logger.error(errorMessage);
						}
					}),

					init: responseInit,
				};
			}

			return null;

			// MARK: Errors
		} catch (e) {
			const error = e as Error;

			if (vite) vite.ssrFixStacktrace(error);

			const { errorPageHtml: ultimateErrorPage, headers } =
				await createErrorPage('__gracile_error', error);

			return {
				response: new Response(String(ultimateErrorPage), {
					headers,
					status: 500,
					statusText: 'Gracile middleware error',
				}),
			};
		}
	};

	return middleware;
}
