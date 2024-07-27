import type { IncomingMessage, ServerResponse } from 'node:http';
import { type Readable, Writable } from 'node:stream';

import { logger } from '@gracile/internal-utils/logger';
import { createServerAdapter } from '@whatwg-node/server';
import c from 'picocolors';
import type { ViteDevServer } from 'vite';

import { isUnknownObject, type UnknownObject } from '../assertions.js';
import { /*  errorInline, */ errorPage } from '../errors/templates.js';
import {
	type HandlerInfos,
	renderRouteTemplate,
} from '../render/route-template.js';
import { renderSsrTemplate } from '../render/utils.js';
import { getRoute, type RouteInfos } from '../routes/match.js';
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
	const middleware: ConnectLikeAsyncMiddleware = async (req, res, next) => {
		// Typing workaround
		if (!req.url) throw Error('Incorrect url');
		if (!req.method) throw Error('Incorrect method');

		logger.info(`[${c.yellow(req.method)}] ${c.yellow(req.url)}`, {
			timestamp: true,
		});

		// MARK: Skip unwanted requests

		if (
			//
			req.url.endsWith('favicon.ico') ||
			req.url.endsWith('favicon.svg')
		)
			return next();

		const requestPonyfilled = (await Promise.resolve(
			adapter.handleNodeRequest(
				req as IncomingMessage & { url: string; method: string },
			),
		)) as unknown as Request;

		async function renderPageFn(
			handlerInfos: HandlerInfos,
			routeInfos: RouteInfos,
		): Promise<Readable | undefined> {
			const { output } = await renderRouteTemplate({
				request: requestPonyfilled,
				vite,
				mode: 'dev',
				routeInfos,
				handlerInfos,
				routeAssets,
				root,
				serverMode,
			});

			return output || undefined;
		}

		try {
			// MARK: Get route infos

			const moduleInfos = await getRoute({
				url: requestPonyfilled.url,
				vite,
				routes,
				routeImports,
			});

			let output: Readable | Response | undefined;

			// TODO: should move this to `special-file` so we don't recalculate on each request
			// + we would be able to do some route codegen.
			const response: ResponseInit = {};

			// NOTE: Only for Express for now.

			let locals: UnknownObject = {};
			if ('locals' in res && isUnknownObject(res.locals)) locals = res.locals;

			// MARK: Server handler

			const handler = moduleInfos.routeModule.handler;

			if (
				'handler' in moduleInfos.routeModule &&
				typeof handler !== 'undefined'
			) {
				const options = {
					request: requestPonyfilled,
					url: new URL(requestPonyfilled.url),
					response,
					params: moduleInfos.params,
					locals,
				};

				// MARK: Top level handler

				if (typeof handler === 'function') {
					const handlerOutput = (await Promise.resolve(
						handler(options),
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
						handlerWithMethod(options) as unknown,
					);

					if (handlerOutput instanceof Response) output = handlerOutput;
					else {
						output = await renderPageFn(
							{
								data: handlerOutput,
								method: requestPonyfilled.method,
							},
							moduleInfos,
						);
					}

					// MARK: No GET, render page
				} else if (
					handler &&
					'GET' in handler === false &&
					requestPonyfilled.method === 'GET'
				) {
					output = await renderPageFn(
						{ data: null, method: 'GET' },
						moduleInfos,
					);
				}
				// MARK: No handler, render page
			} else {
				output = await renderPageFn({ data: null, method: 'GET' }, moduleInfos);
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

				if (output.body)
					output.body
						.pipeTo(Writable.toWeb(res))
						.catch((e) => logger.error(String(e)));
				// else throw new Error('Missing body.');
				else return res.end(output);

				// MARK: Stream page render
			} else {
				new Headers(response.headers)?.forEach((content, header) =>
					res.setHeader(header, content),
				);
				if (response.status) res.statusCode = response.status;
				if (response.statusText) res.statusMessage = response.statusText;

				res.setHeader('Content-Type', 'text/html');

				// MARK: Page stream error

				output
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
						res.end('' /* errorInline(error) */);
					})
					.pipe(res);
			}

			// MARK: Errors
		} catch (e) {
			const error = e as Error;
			if (vite) vite.ssrFixStacktrace(error);
			// else
			logger.error(error.message);

			if (error.cause === 404) {
				// TODO: Handle 404 with dedicated page
				if (!vite) return next();

				res.statusCode = 404;
				return res.end('404');
				// TODO: use a nice framework service page
				// .redirect(new URL('/__404/', requestPonyfilled.url).href)
			}

			let errorTemplate = await renderSsrTemplate(errorPage(error));
			if (vite)
				errorTemplate = await vite.transformIndexHtml(req.url, errorTemplate);

			res.statusCode = 500;
			return res.end(errorTemplate);
		}

		return next();
	};

	return middleware;
}
