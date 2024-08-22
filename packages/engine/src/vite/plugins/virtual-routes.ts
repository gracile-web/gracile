import { createFilter, type Plugin } from 'vite';

import type { RenderedRouteDefinition } from '../../build/static.js';
import type { RoutesManifest } from '../../routes/route.js';
import type { GracileConfig } from '../../user-config.js';

export function virtualRoutes({
	// root,
	routes,
	renderedRoutes,
}: {
	// root: string;
	routes: RoutesManifest;
	renderedRoutes: RenderedRouteDefinition[];
}) {
	const virtualModuleId = 'gracile:routes';
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;

	// TODO: Remove handler when prerendering route
	const routesWithoutPrerender = [...routes];
	const renderedRoutesWithoutPrerender = renderedRoutes;
	// const routesWithoutPrerender = [...routes].filter(
	// 	([, r]) => r.prerender !== true,
	// );
	// const renderedRoutesWithoutPrerender = renderedRoutes.filter(
	// 	(r) => r.savePrerender !== true,
	// );

	return [
		{
			name: 'gracile-server-routes',

			resolveId(id) {
				if (id === virtualModuleId) {
					return resolvedVirtualModuleId;
				}
				return null;
			},

			load(id) {
				if (id === resolvedVirtualModuleId) {
					return `
import { URLPattern } from '@gracile/gracile/url-pattern';

const routes = new Map(${
						//
						JSON.stringify(routesWithoutPrerender, null, 2).replaceAll(
							// NOTE: Not strictly necessary, but just in case.
							'"pattern": {}',
							'"pattern": null',
						)
					})
routes.forEach((route, pattern) => {
	route.pattern = new URLPattern(pattern, 'http://gracile');
});

const routeImports = new Map(
	[
		${routesWithoutPrerender
			.map(
				([pattern, route]) =>
					`['${pattern}', () => import('/${route.filePath}')],`,
			)
			.join('\n		')}
	]
);

const routeAssets = new Map(${JSON.stringify(
						[
							...renderedRoutesWithoutPrerender.map((r) => [
								`/${r.name
									//
									.replace(/index\.html$/, '')
									.replace(/* Error pages */ /\.html$/, '/')}`,
								r.handlerAssets,
							]),
						],
						null,
						2,
					)});

export { routes, routeImports, routeAssets };
`;
				}

				return null;
			},
		} satisfies Plugin,
	];
}

// TODO: move to CSR package?
// It's very tiny and can act as a stub.
// Could be documented for user, too? For allowing custom implementations.
export function virtualRoutesClient({
	routes: routesMap,
	mode = 'server',
	gracileConfig,
}: {
	routes: RoutesManifest;
	mode: 'static' | 'server';
	gracileConfig: GracileConfig;
}) {
	const virtualModuleId = 'gracile:client:routes';
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;

	const enabled = gracileConfig.pages?.premises?.expose;

	const premisesFilter = createFilter(
		gracileConfig.pages?.premises?.include,
		gracileConfig.pages?.premises?.exclude,
	);

	return [
		{
			name: 'gracile-client-routes',

			// TODO: Proper invalidation!

			resolveId(id) {
				if (id === virtualModuleId) {
					return resolvedVirtualModuleId;
				}
				return null;
			},

			load(id) {
				if (id === resolvedVirtualModuleId) {
					if (!routesMap || routesMap.size < 1) return '';

					const routes = [...routesMap].filter((r) =>
						premisesFilter(r[1].filePath),
					);

					return `
const routeImports = new Map(
	[ 
		${
			enabled
				? routes
						.map(
							([pattern, route]) =>
								`['${pattern}', () => import('/${route.filePath}')],`,
						)
						.join('\n		')
				: '/* DISABLED */'
		}
	]
);

export const enabled = ${enabled};

export const mode = '${mode}';

export { routeImports };
`;
				}

				return null;
			},
		} satisfies Plugin,
	];
}
