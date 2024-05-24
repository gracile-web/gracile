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
					// TODO: Harmonize serialization
					return `
const routeModules = new Map();

${[...routes]
	.map(([pattern, route]) => {
		return `
routeModules.set('${pattern}', () => import('/${route.filePath}'))
`.trim();
	})
	.join('\n')}

const routes = new Map(${JSON.stringify([...routes], null, 2)})

export { routes, routeModules };

export const routeAssets = new Map();

${renderedRoutes
	.map(
		(r) => `
routeAssets.set('${`/${r.name.replace(/index\.html$/, '')}`}', ${JSON.stringify(r.handlerAssets)});
`,
	)
	.join('\n')}

					`;
				}

				return null;
			},
		} satisfies Plugin,
	];
}
