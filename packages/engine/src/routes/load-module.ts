import type { ViteDevServer } from 'vite';

import * as R from './route.js';

// const ROUTE_SPREAD = /^\.{3}.+$/;
export const REGEXES = {
	//
	param: /\[(.*?)\]/,
	rest: /^\[\.\.\.(.*)\]$/,
	restWithExt: /^\[\.\.\.(.*)\]\.[j|t]s$/,
	dynamicSplit: /\[(.+?\(.+?\)|.+?)\]/,

	// index: /^(index\.(js|ts)|\((.*)\)\.(js|ts))$/,
	index: /\((.*)\)/,
};

export async function loadForeignRouteObject(
	vite: ViteDevServer,
	routePath: string,
) {
	// NOTE: Check and assert unknown userland module to correct RouteModule instance (in the engine's realm)
	const rm = await vite.ssrLoadModule(routePath);
	const routeModuleFactory = rm['default'] as unknown;

	const errorBase = `Incorrect route module ${routePath}!`;

	if (typeof routeModuleFactory !== 'function')
		throw new Error(`${errorBase} Not a function.`);

	const routeModule = routeModuleFactory(R.RouteModule) as unknown;

	if (routeModule instanceof R.RouteModule === false)
		throw new Error(`${errorBase} Not a RouteModule.`);

	return routeModule;
}
