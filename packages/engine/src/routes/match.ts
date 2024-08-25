import type { ViteDevServer } from 'vite';

import { loadForeignRouteObject } from './load-module.js';
import type * as R from './route.js';

type Params = Record<string, string | undefined>;

type MatchedRoute = {
	match: URLPatternResult | undefined;
	foundRoute: R.Route;
	params: Params;
	pathname: string;
};

// FIXME: proper DI for routes
function matchRouteFromUrl(
	url: string,
	routes: R.RoutesManifest,
): MatchedRoute | null {
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

	if (!match || !foundRoute) return null;

	const params: Params = Object.freeze({ ...match.pathname.groups });

	return { match, foundRoute, params, pathname };
}

type ExtractedStaticPaths = {
	staticPaths: R.StaticPathOptionsGeneric[];
	props: unknown;
} | null;
async function extractStaticPaths(options: {
	routeModule: R.RouteModule;
	foundRoute: R.Route;
	params: Params;
	pathname: string;
}): Promise<ExtractedStaticPaths> {
	if (!options.foundRoute.hasParams) return null;
	if (!options.routeModule.staticPaths) return null;

	const routeStaticPaths = options.routeModule.staticPaths;

	let props: unknown;

	const staticPaths = await Promise.resolve(routeStaticPaths());

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
		// throw new Error(
		// 	`Incorrect route parameters for \`${options.pathname}\`.\n` +
		// 		`Check \`staticPaths\` for \`${options.foundRoute.filePath}\`.`,
		// );
		return null;

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
	vite?: ViteDevServer | undefined;
	routes: R.RoutesManifest;
	routeImports?: R.RoutesImports | undefined;
}): Promise<RouteInfos | null> {
	// throw new GracileError(new Error(`No route matching for ${url}`), {
	// 	cause: 404,
	// });
	const matchedRoute = matchRouteFromUrl(options.url, options.routes);
	if (!matchedRoute) return matchedRoute;
	const { foundRoute, pathname, params } = matchedRoute;

	// TODO: Simplify all the routes things
	const routeModule = await loadForeignRouteObject({
		vite: options.vite,
		route: foundRoute,
		routeImports: options.routeImports,
	});

	let staticPaths: ExtractedStaticPaths | null = null;
	if (routeModule.staticPaths) {
		staticPaths = await extractStaticPaths({
			routeModule,
			foundRoute,
			pathname,
			params,
		});
		if (!staticPaths) return null;
	}

	return {
		params,
		props: staticPaths?.props,
		routeModule,
		foundRoute,
		pathname,
	};
}
