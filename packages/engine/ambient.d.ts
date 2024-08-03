/// <reference types="vite/client" />

// NOTE: It's not exposed to user-land anyway, and gets bundled away
// declare module 'gracile:routes' {
// 	export const routes: import('./src/routes/route.js').RoutesManifest;
// 	export const routeImports: import('./src/routes/route.js').RoutesImports;
// 	export const routeAssets: import('./src/routes/route.js').RoutesAssets;
// }

declare namespace App {
	interface Locals {}
}
