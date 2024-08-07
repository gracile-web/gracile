import { Readable } from 'node:stream';

import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';
import type { ErrorPayload, ViteDevServer } from 'vite';

import * as assert from '../assertions.js';
import { errorPage } from '../errors/templates.js';
import { renderRouteTemplate } from '../render/route-template.js';
import { renderSsrTemplate } from '../render/utils.js';
import { getRoute } from '../routes/match.js';
import type * as R from '../routes/route.js';

// type NextFunction = (error?: unknown) => void | Promise<void>;

export type GracileHandler = (
	request: Request,
	locals?: unknown,
) => Promise<
	| { response: Response; body?: never; init?: never }
	| { response?: never; body: Readable; init: ResponseInit }
	| null
>;

const CONTENT_TYPE_HTML = { 'Content-Type': 'text/html' };

export function createGracileHandler({
	vite,
	routes,
	routeImports,
	routeAssets,
	root,
	serverMode,
}: {
	vite?: ViteDevServer | undefined;
	routes: R.RoutesManifest;
	routeImports?: R.RoutesImports | undefined;
	routeAssets?: R.RoutesAssets;
	root: string;
	serverMode?: boolean | undefined;
}) {
	async function createErrorPage(urlPath: string, e: Error) {
		logger.error(e.message);

		let errorPageHtml = await renderSsrTemplate(errorPage(e));
		if (vite)
			errorPageHtml = await vite.transformIndexHtml(urlPath, errorPageHtml);

		return { errorPageHtml, headers: { ...CONTENT_TYPE_HTML } };
	}

	const middleware: GracileHandler = async (request, locals) => {
		try {
			// NOTE: Maybe it should be constructed from `req`
			const { url: fullUrl, method } = request;

			// MARK: Get route infos

			const routeOptions = {
				url: fullUrl,
				vite,
				routes,
				routeImports,
			};

			const routeInfos = await getRoute(routeOptions).catch(async (error) => {
				// MARK: User defined Gracile 404
				logger.error(String(error));
				const url = new URL('/404/', fullUrl).href;
				const options = { ...routeOptions, url };
				const notFound = await getRoute(options).catch(() => null);
				return notFound;
			});

			if (routeInfos === null) {
				// MARK: Default, fallback 404
				const message = `404 not found!\n\n---\n\nCreate a /src/routes/404.{js,ts} to get a custom page.\n${method} - ${fullUrl}`;

				const { errorPageHtml, headers } = await createErrorPage(
					fullUrl,
					new Error(message),
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
				request,
				vite,
				mode: 'dev', // vite && vite.config.mode === 'dev' ? 'dev' : 'build',
				routeAssets,
				root,
				serverMode,
				routeInfos,
			} as const;

			logger.info(`[${c.yellow(method)}] ${c.yellow(fullUrl)}`, {
				timestamp: true,
			});

			let output: Readable | Response | null;

			let providedLocals: assert.UnknownObject = {};
			if (locals && assert.isUnknownObject(locals)) providedLocals = locals;

			// MARK: Server handler

			const handler = routeInfos.routeModule.handler;

			const responseInit: ResponseInit = {};
			// TODO: should move this to `special-file` so we don't recalculate on each request
			// + we would be able to do some route codegen.

			if (
				('handler' in routeInfos.routeModule &&
					typeof handler !== 'undefined') ||
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
				// MARK: Top level handler

				if (typeof handler === 'function') {
					const handlerOutput = (await Promise.resolve(
						handler(routeContext),
					)) as unknown;
					if (assert.isResponseOrPatchedResponse(handlerOutput))
						output = handlerOutput;
					else
						throw new TypeError(
							'Catch-all handler must return a Response object.',
						);

					// MARK: Handler with method
				} else if (method in handler) {
					const handlerWithMethod = handler[method as keyof typeof handler];

					if (typeof handlerWithMethod !== 'function')
						throw TypeError('Handler must be a function.');

					const handlerOutput = await Promise.resolve(
						handlerWithMethod(routeContext) as unknown,
					);

					if (assert.isResponseOrPatchedResponse(handlerOutput))
						output = handlerOutput;
					else {
						output = await renderRouteTemplate({
							...routeTemplateOptions,
							handlerInfos: { data: handlerOutput, method },
							routeInfos,
						}).then((r) => r.output);
					}

					// MARK: No GET, render page
				} else {
					const statusText = `This route doesn't handle the \`${method}\` method!`;
					return {
						response: new Response(statusText, { status: 405, statusText }),
					};
				}
			} else {
				output = await renderRouteTemplate({
					...routeTemplateOptions,
					handlerInfos: { data: null, method: 'GET' },
					routeInfos,
				}).then((r) => r.output);
			}

			// MARK: Return response

			// NOTE: try directly with the requestPonyfill. This might not be necessary
			if (assert.isResponseOrPatchedResponse(output)) {
				if (output.status >= 300 && output.status <= 303) {
					const location = output.headers.get('location');

					if (location) {
						return { response: Response.redirect(location, output.status) };
					}
				}

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
						}

						logger.error(errorMessage);
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
