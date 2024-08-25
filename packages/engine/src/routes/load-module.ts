import { collectErrorMetadata } from '@gracile-labs/better-errors/dev/utils';
import { enhanceViteSSRError } from '@gracile-labs/better-errors/dev/vite';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { type ViteDevServer } from 'vite';

import { GracileError, GracileErrorData } from '../errors/errors.js';
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

const incorrectRouteModuleError = (p: string) =>
	new GracileError({
		...GracileErrorData.InvalidRouteExport,
		message: GracileErrorData.InvalidRouteExport.message(p),
	});

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

	if (vite) {
		try {
			unknownRouteModule = await vite.ssrLoadModule(
				route.filePath /* + 's' */,
				{},
			);
		} catch (e) {
			const err = e;

			const filePath = pathToFileURL(join(vite.config.root, route.filePath));
			const rootFolder = pathToFileURL(vite.config.root);

			// NOTE: Maybe it's not required here? But just upstream (safeError…)
			const enhance = enhanceViteSSRError({
				error: err,
				filePath,
				// @ts-expect-error Typings mismatches
				vite,
			});

			const errorWithMetadata = collectErrorMetadata(enhance, rootFolder);

			throw errorWithMetadata as Error;
		}
	} else if (routeImports) {
		const ri = routeImports.get(route.pattern.pathname);

		if (ri) unknownRouteModule = await Promise.resolve(ri());
	}

	if (unknownRouteModule === null) throw new Error('Cannot find route module.');

	const routeModuleFactory = unknownRouteModule['default'];
	if (typeof routeModuleFactory !== 'function')
		throw incorrectRouteModuleError(route.filePath);

	const routeModule = routeModuleFactory(R.RouteModule) as unknown;
	if (routeModule instanceof R.RouteModule === false)
		throw incorrectRouteModuleError(route.filePath);

	return routeModule;
}
