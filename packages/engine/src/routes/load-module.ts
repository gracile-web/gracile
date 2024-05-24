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

export async function loadForeignRouteObject({
	vite,
	route,
	routeImports,
}: {
	vite?: ViteDevServer | undefined;
	route: R.Route;
	routeImports?: R.RoutesImports | undefined;
}) {
	// NOTE: Check and assert unknown userland module to correct RouteModule instance (in the engine's realm)

	let unknownRouteModule: Record<string, unknown> | null = null;

	if (vite) unknownRouteModule = await vite.ssrLoadModule(route.filePath);
	else if (routeImports) {
		const ri = routeImports.get(route.pattern.pathname);
		if (ri) unknownRouteModule = ri();
	}

	if (unknownRouteModule === null) throw new Error('Cannot find route module.');

	const routeModuleFactory = unknownRouteModule['default'];

	const errorBase = `Incorrect route module ${route.filePath}!`;

	if (typeof routeModuleFactory !== 'function')
		throw new Error(`${errorBase} Not a function.`);

	const routeModule = routeModuleFactory(R.RouteModule) as unknown;

	if (routeModule instanceof R.RouteModule === false)
		throw new Error(`${errorBase} Not a RouteModule.`);

	return routeModule;
}
