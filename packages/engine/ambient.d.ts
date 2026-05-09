/// <reference types="vite/client" />

// NOTE: It's not exposed to user-land anyway, and gets bundled away
// declare module 'gracile:routes' {
// 	export const routes: import('@gracile/engine/routes/route').RoutesManifest;
// 	export const routeImports: import('@gracile/engine/routes/route').RoutesImports;
// 	export const routeAssets: import('@gracile/engine/routes/route').RoutesAssets;
// }

declare module 'gracile:handler' {
	export const handler: import('@gracile/engine/server/request').GracileHandler;
}

declare namespace Gracile {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Locals {
		/* Mergeable */
	}
}

declare module 'gracile:client:routes' {
	export const enabled: boolean;

	export const mode: 'static' | 'server';

	export const trailingSlash: 'always' | 'never' | 'ignore';

	export const routeImports: Map<
		string,
		() => Promise<{
			default: (
				routeModule: typeof import('@gracile/engine/routes/route').RouteModule,
			) => import('@gracile/engine/routes/route').RouteModule;
		}>
	>;
}
