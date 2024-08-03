import type { IncomingMessage, ServerResponse } from 'node:http';
import { Readable, Writable } from 'node:stream';

import { logger } from '@gracile/internal-utils/logger';
import { createServerAdapter } from '@whatwg-node/server';
import c from 'picocolors';
import type { ViteDevServer } from 'vite';

import { isUnknownObject, type UnknownObject } from '../assertions.js';
import { errorPage } from '../errors/templates.js';
import { renderRouteTemplate } from '../render/route-template.js';
import { renderSsrTemplate } from '../render/utils.js';
import { getRoute } from '../routes/match.js';
import type * as R from '../routes/route.js';

type NextFunction = (error?: unknown) => void | Promise<void>;

/**
 * This is fully compatible with Express or bare Node HTTP
 * What it adds on top of Connect-style middleware:
 * 1. Async.
 * 2. Can return a `ServerResponse`
 */
export type ConnectLikeAsyncMiddleware = (
	req: IncomingMessage,
	res: ServerResponse,
	next: NextFunction,
	locals?: unknown,
) => // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
| Promise<void | NextFunction | ServerResponse>
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	| (void | NextFunction | ServerResponse);

// NOTE: Find a more canonical way to ponyfill the Node HTTP request to standard Request
// @ts-expect-error Abusing this feature!
const adapter = createServerAdapter((request) => request);

export function createGracileMiddleware({
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
	const middleware: ConnectLikeAsyncMiddleware = async (
		req,
		res,
		next,
		locals,
	) => {
		// HACK: Typing workaround
		if (!req.url) throw Error('Incorrect url');
		if (!req.method) throw Error('Incorrect method');
		const { url: urlPath, method } = req;

		// if (urlPath === '/favicon.ico') return next();

		async function createErrorPage(e: Error) {
			logger.error(e.message);

			let errorPageHtml = await renderSsrTemplate(errorPage(e));
			if (vite)
				errorPageHtml = await vite.transformIndexHtml(urlPath, errorPageHtml);
			return errorPageHtml;
		}

		try {
			const requestPonyfilled = (await Promise.resolve(
				adapter.handleNodeRequest(
					// HACK: Incorrect typings
					req as IncomingMessage & { url: string; method: string },
				),
			)) as unknown as Request;

			// NOTE: Maybe it should be constructed from `req`
			const fullUrl = requestPonyfilled.url;

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
				const message = `404 not found!\n\n---\n\nCreate a /src/routes/404.{js,ts} to get a custom page.\n${method} - ${urlPath}`;
				res.statusCode = 404;
				res.statusMessage = '404 not found!';
				const errorPage404 = await createErrorPage(new Error(message));
				return res.end(errorPage404);
			}

			const routeTemplateOptions = {
				request: requestPonyfilled,
				vite,
				mode: 'dev', // vite && vite.config.mode === 'dev' ? 'dev' : 'build',
				routeAssets,
				root,
				serverMode,
				routeInfos,
			} as const;

			logger.info(`[${c.yellow(method)}] ${c.yellow(urlPath)}`, {
				timestamp: true,
			});

			let output: Readable | Response | null;

			// TODO: should move this to `special-file` so we don't recalculate on each request
			// + we would be able to do some route codegen.
			const response: ResponseInit = {};

			// NOTE: Only for Express for now.

			// console.log({ locals });
			let providedLocals: UnknownObject = {};
			// if ('locals' in res && isUnknownObject(res.locals)) locals = res.locals;
			if (locals && isUnknownObject(locals)) providedLocals = locals;

			// MARK: Server handler

			const handler = routeInfos.routeModule.handler;

			if (
				'handler' in routeInfos.routeModule &&
				typeof handler !== 'undefined'
			) {
				const routeContext = Object.freeze({
					request: requestPonyfilled,
					url: new URL(fullUrl),
					response,
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
					if (handlerOutput instanceof Response) output = handlerOutput;
					else
						throw new TypeError(
							'Catch-all handler must return a Response object.',
						);

					// MARK: Handler with method
				} else if (requestPonyfilled.method in handler) {
					const handlerWithMethod =
						handler[requestPonyfilled.method as keyof typeof handler];

					if (typeof handlerWithMethod !== 'function')
						throw TypeError('Handler must be a function.');

					const handlerOutput = await Promise.resolve(
						handlerWithMethod(routeContext) as unknown,
					);

					if (handlerOutput instanceof Response) output = handlerOutput;
					else {
						output = await renderRouteTemplate({
							...routeTemplateOptions,
							handlerInfos: { data: handlerOutput, method },
						}).then((r) => r.output);
					}

					// MARK: No GET, render page
				} else if (
					handler &&
					'GET' in handler === false &&
					requestPonyfilled.method === 'GET'
				) {
					output = await renderRouteTemplate({
						...routeTemplateOptions,
						handlerInfos: { data: null, method: 'GET' },
						routeInfos,
					}).then((r) => r.output);
				} else {
					const message = `This route doesn't handle the \`${method}\` method!`;
					res.statusCode = 404;
					res.statusMessage = message;
					return res.end(await createErrorPage(new Error(message)));
				}
			} else {
				output = await renderRouteTemplate({
					...routeTemplateOptions,
					handlerInfos: { data: null, method: 'GET' },
				}).then((r) => r.output);
			}

			// MARK: Return response

			// NOTE: try directly with the requestPonyfill. This might not be necessary
			if (output instanceof Response) {
				if (output.status >= 300 && output.status <= 303) {
					const location = output.headers.get('location');

					// if (location) return res.redirect(location);
					if (location) {
						res.statusCode = output.status;
						res.setHeader('location', location);
						return res.end(`Found. Redirecting to ${location}`);
					}
				}

				output.headers?.forEach((content, header) =>
					res.setHeader(header, content),
				);
				if (output.status) res.statusCode = output.status;
				if (output.statusText) res.statusMessage = output.statusText;

				// TODO: use this with page only?
				// if (output.bodyUsed === false)
				//   throw new Error('Missing body.');

				if (output.body) {
					const piped = await output.body
						.pipeTo(Writable.toWeb(res))
						.catch((e) => logger.error(String(e)));
					return piped;
				}
				// else throw new Error('Missing body.');
				// NOTE: Other shapes
				return res.end(output);

				// MARK: Stream page render
			}

			new Headers(response.headers)?.forEach((content, header) =>
				res.setHeader(header, content),
			);
			if (response.status) res.statusCode = response.status;
			if (response.statusText) res.statusMessage = response.statusText;

			res.setHeader('Content-Type', 'text/html');

			// MARK: Page stream error

			return output
				?.on('error', (error) => {
					const errorMessage =
						`There was an error while rendering a template chunk on server-side.\n` +
						`It was omitted from the resulting HTML.`;
					logger.error(errorMessage);
					logger.error(error.message);

					res.statusCode = 500;
					res.statusMessage = errorMessage;

					/* NOTE: Safety closing tags, maybe add more */
					// Maybe just returning nothing is better to not break the page?
					// Should send a overlay message anyway via WebSocket
					// vite.ws.send()
					if (vite)
						setTimeout(() => {
							vite.hot.send('gracile:ssr-error', {
								message: errorMessage,
							});
						}, 500);
					return res.end('' /* errorInline(error) */);
				})
				.pipe(res);

			// MARK: Errors
		} catch (e) {
			const error = e as Error;

			if (vite) vite.ssrFixStacktrace(error);

			const ultimateErrorPage = await createErrorPage(error);

			res.statusCode = 500;
			res.statusMessage = 'Gracile middleware error';
			return res.end(ultimateErrorPage);
		}
	};

	return middleware;
}
