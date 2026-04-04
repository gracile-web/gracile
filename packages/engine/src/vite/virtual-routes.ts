import { normalizeToPosix } from '@gracile/internal-utils/paths';
import { createFilter, type Plugin, type ViteDevServer } from 'vite';

import type { RoutesManifest } from '../routes/route.js';
import type { GracileConfig } from '../user-config.js';

import type { PluginSharedState } from './plugin-shared-state.js';
import { GRACILE_ENVIRONMENT_NAMES } from './constants.js';

export const GRACILE_CLIENT_ROUTES_MODULE_ID = 'gracile:client:routes';
export const RESOLVED_GRACILE_CLIENT_ROUTES_MODULE_ID = `\0${GRACILE_CLIENT_ROUTES_MODULE_ID}`;

export function invalidateClientRoutesModule(server: ViteDevServer): void {
	const virtualModule = server.environments.client.moduleGraph.getModuleById(
		RESOLVED_GRACILE_CLIENT_ROUTES_MODULE_ID,
	);

	if (!virtualModule) return;

	server.environments.client.moduleGraph.invalidateModule(
		virtualModule,
		/* Invalidated modules, unused, reset each time. */ new Set(),
		Date.now(),
		true,
	);
}

/**
 * Server-side routes virtual module (`gracile:routes`).
 *
 * Scoped to the SSR build environment via `applyToEnvironment`.
 * Reads from shared state lazily so `renderedRoutes` is available
 * (populated during the client build).
 */
export function virtualRoutes({
	state,
}: {
	state: PluginSharedState;
}): Plugin[] {
	const virtualModuleId = 'gracile:routes';
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;

	return [
		{
			name: 'gracile-server-routes',
			apply: 'build',

			applyToEnvironment(environment) {
				return environment.name === GRACILE_ENVIRONMENT_NAMES.ssr;
			},

			resolveId(id) {
				if (id === virtualModuleId) {
					return resolvedVirtualModuleId;
				}
				return null;
			},

			load(id) {
				if (id !== resolvedVirtualModuleId) return null;

				const routes = state.routes;
				const renderedRoutes = state.renderedRoutes;
				if (!routes || routes.size === 0 || !renderedRoutes) return null;

				const routesArray = [...routes];

				return `
const routes = new Map(${
					//
					JSON.stringify(routesArray, null, 2).replaceAll(
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
		${routesArray
			.map(
				([pattern, route]) =>
					`['${pattern}', () => import('/${normalizeToPosix(route.filePath)}')],`,
			)
			.join('\n		')}
	]
);

const routeAssets = new Map(${JSON.stringify(
					renderedRoutes.map((r) => [
						`/${r.name
							//
							.replace(/index\.html$/, '')
							.replace(/* Error pages */ /\.html$/, '/')}`,
						r.handlerAssets,
					]),
					null,
					2,
				)});

export { routes, routeImports, routeAssets };
`;
			},
		} as const,
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
}): Plugin[] {
	const virtualModuleId = GRACILE_CLIENT_ROUTES_MODULE_ID;
	const resolvedVirtualModuleId = RESOLVED_GRACILE_CLIENT_ROUTES_MODULE_ID;

	const premisesFilter = createFilter(
		gracileConfig.pages?.premises?.include,
		gracileConfig.pages?.premises?.exclude,
	);

	return [
		{
			name: 'gracile-client-routes',

			config() {
				return {
					// NOTE: Prevent a bug that happens only when Gracile is built.
					optimizeDeps: { exclude: [virtualModuleId] },
				};
			},

			resolveId(id) {
				if (id === virtualModuleId) {
					return resolvedVirtualModuleId;
				}
				return null;
			},

			load(id) {
				if (id === resolvedVirtualModuleId) {
					if (!routesMap || routesMap.size === 0) return '';

					const routes = [...routesMap].filter((r) =>
						premisesFilter(r[1].filePath),
					);

					return `
const routeImports = new Map(
	[ 
		${routes
			.map(
				([pattern, route]) =>
					`['${pattern}', () => import('/${normalizeToPosix(route.filePath)}')],`,
			)
			.join('\n		')}
	]
);

export const enabled = true;

export const mode = '${mode}';
export const trailingSlash = '${gracileConfig.trailingSlash ?? 'ignore'}';

export { routeImports };
`;
				}

				return null;
			},
		} as const,
	];
}
