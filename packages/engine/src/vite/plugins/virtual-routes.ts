import type { Plugin } from 'vite';

import type { RenderedRouteDefinition } from '../../build/static.js';
import type { RoutesManifest } from '../../routes/route.js';

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

const routes = new Map(${JSON.stringify(routesWithoutPrerender, null, 2)})
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
			.join('\n')}
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
