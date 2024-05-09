import type { ViteDevServer } from 'vite';

import { routes } from './collect.js';
import { loadForeignRouteObject } from './load-module.js';
import * as R from './route.js';

type Params = Record<string, string | undefined>;

type MatchedRoute = {
	match: URLPatternResult | undefined;
	foundRoute: R.Route;
	params: Params;
	pathname: string;
};
function matchRouteFromUrl(url: string): MatchedRoute {
	let match: URLPatternResult | undefined;
	let foundRoute: R.Route | undefined;

	const pathname = new URL(url).pathname;

	// eslint-disable-next-line no-restricted-syntax
	for (const [, route] of routes) {
		if (match) break;

		const matchResult =
			route.pattern.exec(`http://gracile${pathname}`) || undefined;

		if (matchResult) {
			match = matchResult;
			foundRoute = route;
		}
	}

	if (!match || !foundRoute)
		throw new Error(`No route matching for ${url}`, { cause: 404 });

	const params: Params = match.pathname?.groups;

	return { match, foundRoute, params, pathname };
}

type ExtractedStaticPaths = {
	staticPaths: R.StaticPathOptionsGeneric[];
	props: unknown;
} | null;
function extractStaticPaths(options: {
	routeModule: R.RouteModule;
	foundRoute: R.Route;
	params: Params;
	pathname: string;
}): ExtractedStaticPaths {
	if (!options.foundRoute.hasParams) return null;
	if (!options.routeModule.staticPaths) return null;

	const routeStaticPaths = options.routeModule.staticPaths;

	let props: unknown;

	const staticPaths = routeStaticPaths();

	let hasCorrectParams = false;

	staticPaths.forEach((providedRouteOptions) => {
		const routeOptions = providedRouteOptions;

		const matchingKeys = Object.entries(routeOptions.params).filter(
			([key, val]) => options.params[key] === val,
		);

		if (matchingKeys.length === Object.keys(options.params).length) {
			hasCorrectParams = true;

			if (routeOptions.props) props = routeOptions.props;
		}
	});

	if (hasCorrectParams === false)
		throw new Error(
			`Incorrect route parameters for \`${options.pathname}\`.\n` +
				`Check \`staticPaths\` for \`${options.foundRoute.filePath}\`.`,
		);

	return { staticPaths, props };
}

export type RouteInfos = {
	params: Params;
	props: unknown;
	routeModule: Readonly<R.RouteModule>;
	foundRoute: R.Route;
	pathname: string;
};
export async function getRoute(options: {
	url: string;
	vite: ViteDevServer;
}): Promise<RouteInfos> {
	const { foundRoute, pathname, params } = matchRouteFromUrl(options.url);

	const routePath = foundRoute.filePath;

	const routeModule = await loadForeignRouteObject(options.vite, routePath);

	const staticPaths = extractStaticPaths({
		routeModule,
		foundRoute,
		pathname,
		params,
	});

	return {
		params,
		props: staticPaths?.props,
		routeModule,
		foundRoute,
		pathname,
	};
}
