import { Buffer } from 'node:buffer';
import path, { join } from 'node:path';
import type { Readable } from 'node:stream';

import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';
import type { ViteDevServer } from 'vite';

import { renderRouteTemplate } from '../render/route-template.js';
import { collectRoutes, routes } from '../routes/collect.js';
import { loadForeignRouteObject } from '../routes/load-module.js';

export interface RenderedRouteDefinition {
	absoluteId: string;
	name: string;
	html: string;

	handlerAssets?: string;

	savePrerender: boolean | null;
}

async function streamToString(stream: Readable) {
	const chunks: Buffer[] = [];

	// eslint-disable-next-line no-restricted-syntax
	for await (const chunk of stream) {
		if (typeof chunk === 'string') {
			chunks.push(Buffer.from(chunk));
		} else throw new Error('Wrong buffer');
	}

	return Buffer.concat(chunks).toString('utf-8');
}

export async function renderRoutes(
	vite: ViteDevServer,
	serverMode: boolean,
	root = process.cwd(),
) {
	logger.info(c.green('Rendering routes…'), { timestamp: true });

	// MARK: Collect
	await collectRoutes(root /* vite */);

	logger.info(c.green('Rendering routes finished'), { timestamp: true });

	const renderedRoutes: RenderedRouteDefinition[] = [];

	// MARK: Iterate modules
	await Promise.all(
		[...routes].map(async ([patternString, route]) => {
			const routeModule = await loadForeignRouteObject({
				vite,
				route,
			});

			const routeStaticPaths = routeModule.staticPaths?.();

			// MARK: Extract data
			await Promise.all(
				(routeStaticPaths ?? [patternString]).map(async (staticPathOptions) => {
					let pathnameWithParams = patternString;

					let params = {};
					let props: unknown;

					// MARK: Convert pattern
					// to real route with static parameters + get props. for after
					if (typeof staticPathOptions === 'object') {
						params = staticPathOptions.params;

						props = staticPathOptions.props;

						Object.entries(staticPathOptions.params).forEach(
							([paramName, value]) => {
								if (typeof value === 'string' || typeof value === 'undefined')
									pathnameWithParams = pathnameWithParams
										.replace(`:${paramName}*`, value || '')
										.replace(`{:${paramName}}`, value || '');
							},
						);
					}

					// MARK: Prepare

					// NOTE: Unused for now
					const isErrorPage =
						pathnameWithParams.match(
							/\/__(.*)$/,
						); /* Could add more (error, etc) */

					const base = isErrorPage
						? path.dirname(pathnameWithParams.slice(1))
						: pathnameWithParams.slice(1);

					const name = path.join(
						base,
						isErrorPage
							? `${pathnameWithParams.split('/').at(-2)?.replace('__', '')}.html`
							: 'index.html',
					);

					const url = new URL(pathnameWithParams, 'http://gracile-static');

					// MARK: Render

					const { output } = await renderRouteTemplate({
						//
						request: { url: url.href },
						vite,
						mode: 'build',
						routeInfos: {
							routeModule,
							params,
							foundRoute: route,
							pathname: pathnameWithParams,
							props,
						},
						root,
					});

					const htmlString = await streamToString(output);

					const existing = renderedRoutes.find(
						(rendered) => rendered?.name === name,
					);
					if (existing)
						throw new Error(
							`${c.red(`"${existing.name}" page was defined twice!`)}\n`,
						);

					renderedRoutes.push({
						// NOTE:
						// Vite's internal build-html plugin only expects *absolute* ids.
						// See https://github.com/vitejs/vite/issues/13406#issuecomment-1801659561

						absoluteId: join(root, name),
						name,
						html: htmlString,
						savePrerender: route.prerender,
					});
				}),
			);
		}),
	);

	return renderedRoutes;
}
