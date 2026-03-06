import { Readable } from 'node:stream';

import { getLogger } from '@gracile/internal-utils/logger/helpers';
import c from 'picocolors';
import type { Logger, ViteDevServer } from 'vite';

import type { emitViteBetterError as emitViteBe } from '../errors/create-vite-better-error.js';
import { builtIn404Page, builtInErrorPage } from '../errors/pages.js';
import { renderRouteTemplate } from '../render/route-template.js';
import { renderLitTemplate } from '../render/lit-ssr.js';
import { getRoute } from '../routes/match.js';
import type * as R from '../routes/route.js';
import type { GracileConfig } from '../user-config.js';

import {
	type HandlerResult,
	CONTENT_TYPE_HTML,
	rewriteHiddenRoutes,
	resolvePremises,
	executeHandler,
	renderWithoutHandler,
	buildResponse,
} from './request-pipeline.js';

export interface AdapterOptions {
	logger?: Logger;
}

/**
 * The underlying handler interface that you can use to build your own adapter.
 */
export type GracileHandler = (
	request: Request,
	locals?: unknown,
) => Promise<HandlerResult>;

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
			emitViteBetterError =
				await import('../errors/create-vite-better-error.js').then(
					({ emitViteBetterError: error }) => error,
				);

		try {
			// MARK: 1. Rewrite hidden route siblings
			const fullUrl = rewriteHiddenRoutes(requestedUrl);

			// MARK: 2. Setup premises
			const premises = resolvePremises(requestedUrl, gracileConfig);

			// MARK: 3. Route resolution + 404 fallback
			const routeOptions = {
				url: fullUrl,
				vite,
				routes,
				routeImports,
			};

			const responseInit: ResponseInit = {};

			let routeInfos = await getRoute(routeOptions);

			if (routeInfos === null) {
				responseInit.status = 404;

				const url = new URL('/404/', fullUrl).href;
				const options = { ...routeOptions, url };
				routeInfos = await getRoute(options);
			}

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
				mode: 'dev' as const,
				routeAssets,
				root,
				serverMode,
				routeInfos,
				docOnly: premises?.documentOnly,
				renderInfo: gracileConfig.litSsr?.renderInfo,
			} satisfies Parameters<typeof renderRouteTemplate>[0];

			logger.info(`[${c.yellow(method)}] ${c.yellow(fullUrl)}`, {
				timestamp: true,
			});

			// MARK: 4. Handler dispatch
			let output: Readable | Response | null;

			const handlerResult = await executeHandler({
				routeInfos,
				method,
				request,
				fullUrl,
				locals,
				responseInit,
				premises,
				routeTemplateOptions,
			});

			if (handlerResult.type === 'response') return handlerResult.value;

			if (handlerResult.type === 'output') {
				output = handlerResult.value;
			} else {
				// MARK: 5. Template-only render (no handler)
				const renderResult = await renderWithoutHandler({
					premises,
					routeTemplateOptions,
				});

				if (renderResult && 'response' in renderResult) return renderResult;

				output = renderResult;
			}

			// MARK: 6. Build final response
			return buildResponse({ output, responseInit, vite, logger });

			// MARK: Errors
		} catch (error) {
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

export {
	type StandardResponse,
	type ResponseWithNodeReadable,
	isRedirect,
} from './request-pipeline.js';
