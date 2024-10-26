/// <reference types="vite/client" />

// NOTE: It's not exposed to user-land anyway, and gets bundled away
// declare module 'gracile:routes' {
// 	export const routes: import('./src/routes/route.js').RoutesManifest;
// 	export const routeImports: import('./src/routes/route.js').RoutesImports;
// 	export const routeAssets: import('./src/routes/route.js').RoutesAssets;
// }

declare namespace Gracile {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Locals {}
}

declare module 'gracile:client:routes' {
	export const enabled: boolean;

	export const mode: 'static' | 'server';

	export const routeImports: Map<
		string,
		() => Promise<{
			default: (
				routeModule: typeof import('@gracile/engine/routes/route').RouteModule,
			) => import('@gracile/engine/routes/route').RouteModule;
		}>
	>;
}
