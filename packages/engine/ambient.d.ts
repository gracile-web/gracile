/// <reference types="vite/client" />

declare module 'gracile:routes' {
	export const routes: import('./src/routes/route.js').RoutesManifest;
	export const routeImports: import('./src/routes/route.js').RoutesImports;
	export const routeAssets: import('./src/routes/route.js').RoutesAssets;
}
