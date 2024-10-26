import { Readable } from 'node:stream';

import * as assert from '@gracile/internal-utils/assertions';
import { getLogger } from '@gracile/internal-utils/logger/helpers';
// import { createSafeError } from '@gracile-labs/better-errors/dev/utils';
import type { BetterErrorPayload } from '@gracile-labs/better-errors/dev/vite';
import c from 'picocolors';
import type { Logger, ViteDevServer } from 'vite';

import type { emitViteBetterError as emitViteBe } from '../errors/create-vite-better-error.js';
// import { GracileError } from '../errors/errors.js';
import { builtIn404Page, builtInErrorPage } from '../errors/pages.js';
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

export interface AdapterOptions {
	logger?: Logger;
}

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
	const logger = getLogger();

	const middleware: GracileHandler = async (request, locals) => {
		const { url: requestedUrl, method } = request;

		let emitViteBetterError: typeof emitViteBe | null = null;
		if (vite)
			emitViteBetterError = await import(
				'../errors/create-vite-better-error.js'
			).then(({ emitViteBetterError: error }) => error);

		try {
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

			const responseInit: ResponseInit = {};

			let routeInfos = await getRoute(routeOptions);

			// MARK: 404
			if (routeInfos === null) {
				responseInit.status = 404;

				const url = new URL('/404/', fullUrl).href;
				const options = { ...routeOptions, url };
				const notFound = await getRoute(options);
				routeInfos = notFound;
			}
			// MARK: fallback 404
			if (routeInfos === null) {
				const page = builtIn404Page(new URL(fullUrl).pathname, Boolean(vite));
				return {
					response: new Response(await renderLitTemplate(page), {
						headers: { ...CONTENT_TYPE_HTML },
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

			if (
				('handler' in routeInfos.routeModule && handler !== undefined) ||
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
				/// eslint-disable-next-line no-inner-declarations
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
						throw new TypeError('Handler must be a function.');

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
						const errorMessage =
							`[SSR Error] There was an error while rendering a template chunk on server-side.\n` +
							`It was omitted from the resulting HTML.\n`;

						if (vite) {
							logger.error(errorMessage + error.stack);

							// emitViteBetterError(new GracileError(GracileErrorData.FailedToGlobalLogger), vite);
							const payload = {
								type: 'error',
								// FIXME: Use the emitViteBetterError instead (but flaky for now with streaming)
								// err: new GracileError({}),
								err: {
									name: 'StreamingError',
									message: errorMessage,
									stack: error.stack,
									hint: 'This is often caused by a wrong template location dynamic interpolation.',
									cause: error,
									// highlightedCode: error.message,
								},
							} satisfies BetterErrorPayload;
							//
							setTimeout(() => {
								// @ts-expect-error ...........
								vite.hot.send(payload);
								// NOTE: Arbitrary value. Lower seems to be too fast, higher is not guaranteed to work.
							}, 200);
						} else {
							logger.error(errorMessage);
						}
					}),

					init: responseInit,
				};
			}

			return null;

			// MARK: Errors
		} catch (error) {
			// const safeError = createSafeError(error);
			// TODO: User defined dev/runtime 500 error
			const ultimateErrorPage =
				vite && emitViteBetterError
					? await emitViteBetterError({ vite, error: error as Error })
					: await renderLitTemplate(builtInErrorPage((error as Error).name));

			return {
				response: new Response(ultimateErrorPage, {
					headers: { ...CONTENT_TYPE_HTML },
					status: 500,
					statusText: 'Gracile middleware error',
				}),
			};
		}
	};

	return middleware;
}
