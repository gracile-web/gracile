import { Buffer } from 'node:buffer';
import path, { join } from 'node:path';
import type { Readable } from 'node:stream';

import { getLogger } from '@gracile/internal-utils/logger/helpers';
import c from 'picocolors';
import type { ViteDevServer } from 'vite';

import { renderRouteTemplate } from '../render/route-template.js';
import type { GracileConfig } from '../user-config.js';

import { collectRoutes } from './collect.js';
import { loadForeignRouteObject } from './load-module.js';
import type { RoutesManifest } from './route.js';

export interface RenderedRouteDefinition {
	absoluteId: string;
	name: string;
	html: string | null;

	handlerAssets?: string;

	static: {
		props: unknown;
		document: string | null;
	};

	savePrerender: boolean | null;
}

async function streamToString(stream: Readable): Promise<string> {
	const chunks: Buffer[] = [];

	for await (const chunk of stream) {
		if (typeof chunk === 'string') {
			chunks.push(Buffer.from(chunk));
		} else throw new TypeError('Wrong buffer');
	}

	return Buffer.concat(chunks).toString('utf8');
}

export async function renderRoutes({
	routes,
	vite,
	serverMode,
	root = process.cwd(),
	gracileConfig,
}: {
	routes: RoutesManifest;
	vite: ViteDevServer;
	serverMode: boolean;
	root?: string;
	gracileConfig: GracileConfig;
}) {
	const logger = getLogger();
	logger.info(c.green('Rendering routes…'), { timestamp: true });

	// MARK: Collect
	await collectRoutes(routes, root, gracileConfig.routes?.exclude);

	const renderedRoutes: RenderedRouteDefinition[] = [];

	// MARK: Iterate modules
	await Promise.all(
		[...routes].map(async ([patternString, route]) => {
			const routeModule = await loadForeignRouteObject({
				vite,
				route,
			});

			// NOTE: Skip rendering base document for server
			if (serverMode && typeof routeModule.document !== 'function') return;

			const routeStaticPaths = await Promise.resolve(
				routeModule.staticPaths?.(),
			);

			// MARK: Extract data
			await Promise.all(
				/* Single route */
				(routeStaticPaths ?? [patternString]).map(async (staticPathOptions) => {
					let pathnameWithParameters = patternString;

					let parameters = {};
					let properties: unknown;

					// MARK: Handler data (for single route only, NOT dynamic)
					if (routeModule.handler) {
						const url = new URL(
							pathnameWithParameters,
							'http://gracile-static',
						);
						const context = {
							url,
							params: {},
							// NOTE: STUB, maybe it should be better to remove them from typings?
							// But that will make more mismatches between static and server.
							request: new Request(url),
							locals: {},
							responseInit: {},
						};
						if (typeof routeModule.handler === 'function') {
							properties = await Promise.resolve(routeModule.handler(context));
						} else if ('GET' in routeModule.handler) {
							properties = {
								GET: await Promise.resolve(routeModule.handler.GET(context)),
							};
						}
					}

					// MARK: Convert pattern
					// to real route with static parameters + get props. for after
					else if (typeof staticPathOptions === 'object') {
						parameters = staticPathOptions.params;

						properties = staticPathOptions.props;

						for (const [parameterName, value] of Object.entries(
							staticPathOptions.params,
						)) {
							if (typeof value === 'string' || value === undefined)
								pathnameWithParameters = pathnameWithParameters
									.replace(`:${parameterName}*`, value || '')
									.replace(`{:${parameterName}}`, value || '');
						}
					}

					// MARK: Prepare

					// NOTE: Unused for now
					const isErrorPage =
						pathnameWithParameters.match(
							/\/__(.*)$/,
						); /* Could add more (error, etc) */

					const base = isErrorPage
						? path.dirname(pathnameWithParameters.slice(1))
						: pathnameWithParameters.slice(1);

					let name = path.join(
						base,
						isErrorPage
							? `${pathnameWithParameters.split('/').at(-2)?.replace('__', '')}.html`
							: 'index.html',
					);
					if (name === '404/index.html') name = '404.html';
					else if (name === '500/index.html') name = '500.html';

					const url = new URL(pathnameWithParameters, 'http://gracile-static');

					// MARK: Render

					const { output, document } = await renderRouteTemplate({
						//
						// request: { url: url.href },
						url: url.href,
						vite,
						mode: 'build',
						routeInfos: {
							routeModule,
							params: parameters,
							foundRoute: route,
							pathname: pathnameWithParameters,
							props: properties,
						},
						root,
						serverMode,
					});

					const htmlString = output
						? await streamToString(output).then((s) =>
								// IMPORTANT: This is a hack for a behavior for which I'm not sure
								// if Lit is taking advantage of. It looks like a fallback.
								// TODO: Check if that breaks some hydration mechanism.
								s.replaceAll('<?>', ''),
							)
						: null;

					const existing = renderedRoutes.find(
						(rendered) => rendered?.name === name,
					);

					// NOTE: IIRC, this happens when two or more routes has the
					// same priority, that will output the same static path.
					if (existing)
						throw new Error(
							`${c.red(`"${existing.name}" page was defined twice!`)}\n`,
						);

					const savePrerender = routeModule.prerender || null;
					const rendered = {
						// NOTE:
						// Vite's internal build-html plugin only expects *absolute* ids.
						// See https://github.com/vitejs/vite/issues/13406#issuecomment-1801659561
						absoluteId: join(root, name),

						name,
						html: htmlString,
						savePrerender,
						static: { props: properties, document },
					} satisfies RenderedRouteDefinition;
					renderedRoutes.push(rendered);
				}),
			);
		}),
	);

	logger.info(c.green('Rendering routes finished'), { timestamp: true });

	return {
		routes,
		renderedRoutes: renderedRoutes.sort((a, b) =>
			a.absoluteId < b.absoluteId ? -1 : 1,
		),
	};
}
