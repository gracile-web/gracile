import type { ViteDevServer } from 'vite';

import { loadForeignRouteObject } from './load-module.js';
import type * as R from './route.js';

type Parameters_ = Record<string, string | undefined>;

type MatchedRoute = {
	match: URLPatternResult | undefined;
	foundRoute: R.Route;
	params: Parameters_;
	pathname: string;
};

export type TrailingSlashRedirect = { redirect: string };

/** @internal Exported for unit testing. */
export function matchRouteFromUrl(
	url: string,
	routes: R.RoutesManifest,
	trailingSlash: 'always' | 'never' | 'ignore' = 'ignore',
): MatchedRoute | TrailingSlashRedirect | null {
	let match: URLPatternResult | undefined;
	let foundRoute: R.Route | undefined;

	const rawPathname = new URL(url).pathname;

	// Handle redirect cases for 'always' and 'never' before matching.
	// Root '/' is exempt — it always keeps its slash.
	if (rawPathname !== '/') {
		if (trailingSlash === 'always' && !rawPathname.endsWith('/'))
			return { redirect: rawPathname + '/' };

		if (trailingSlash === 'never' && rawPathname.endsWith('/'))
			return { redirect: rawPathname.slice(0, -1) };
	}

	// For 'ignore', normalize to trailing-slash so it matches stored patterns.
	const pathname =
		trailingSlash === 'ignore' &&
		rawPathname !== '/' &&
		!rawPathname.endsWith('/')
			? rawPathname + '/'
			: rawPathname;

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

	const parameters: Parameters_ = Object.freeze({ ...match.pathname.groups });

	return { match, foundRoute, params: parameters, pathname };
}

type ExtractedStaticPaths = {
	staticPaths: R.StaticPathOptionsGeneric[];
	props: unknown;
} | null;
/**
 * @param options
 * @param options.routeModule
 * @param options.foundRoute
 * @param options.params
 * @param options.pathname
 */
/** @internal Exported for unit testing. */
export async function extractStaticPaths(options: {
	routeModule: R.RouteModule;
	foundRoute: R.Route;
	params: Parameters_;
	pathname: string;
}): Promise<ExtractedStaticPaths> {
	if (!options.foundRoute.hasParams) return null;
	if (!options.routeModule.staticPaths) return null;

	const routeStaticPaths = options.routeModule.staticPaths;

	let properties: unknown;

	const staticPaths = await Promise.resolve(routeStaticPaths());

	let hasCorrectParameters = false;

	for (const providedRouteOptions of staticPaths) {
		const routeOptions = providedRouteOptions;

		const matchingKeys = Object.entries(routeOptions.params).filter(
			([key, value]) => options.params[key] === value,
		);

		if (matchingKeys.length === Object.keys(options.params).length) {
			hasCorrectParameters = true;

			if (routeOptions.props) properties = routeOptions.props;
		}
	}

	if (hasCorrectParameters === false) return null;

	return { staticPaths, props: properties };
}

export type RouteInfos = {
	params: Parameters_;
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
	trailingSlash?: 'always' | 'never' | 'ignore';
}): Promise<RouteInfos | TrailingSlashRedirect | null> {
	const matchedRoute = matchRouteFromUrl(
		options.url,
		options.routes,
		options.trailingSlash,
	);
	if (!matchedRoute) return null;
	if ('redirect' in matchedRoute) return matchedRoute;
	const { foundRoute, pathname, params } = matchedRoute;

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
