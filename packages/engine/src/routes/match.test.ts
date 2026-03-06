/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { URLPattern as URLPatternPolyfill } from 'urlpattern-polyfill/urlpattern';

const URLPattern =
	URLPatternPolyfill as unknown as typeof globalThis.URLPattern;

import { RouteModule, type Route, type RoutesManifest } from './route.js';
import { matchRouteFromUrl, extractStaticPaths } from './match.js';

// ── Helpers ──────────────────────────────────────────────────────────

function makeRoute(patternString: string, overrides?: Partial<Route>): Route {
	return {
		filePath: `src/routes/${patternString.slice(1) || 'index'}.ts`,
		pattern: new URLPattern(patternString, 'http://gracile/'),
		hasParams: patternString.includes(':'),
		pageAssets: [],
		...overrides,
	};
}

function buildManifest(entries: [string, Route][]): RoutesManifest {
	return new Map(entries);
}

// ── matchRouteFromUrl ────────────────────────────────────────────────

describe('matchRouteFromUrl — basic matching', () => {
	const routes = buildManifest([
		['/', makeRoute('/')],
		['/about/', makeRoute('/about/')],
		['/blog/{:id}/', makeRoute('/blog/{:id}/', { hasParams: true })],
		['/docs/:path*/', makeRoute('/docs/:path*/', { hasParams: true })],
	]);

	test('matches root /', () => {
		const result = matchRouteFromUrl('http://gracile/', routes);
		assert.ok(result);
		assert.ok(!('redirect' in result));
		assert.equal(result.pathname, '/');
		assert.deepEqual(result.params, {});
	});

	test('matches static /about/', () => {
		const result = matchRouteFromUrl('http://gracile/about/', routes);
		assert.ok(result);
		assert.ok(!('redirect' in result));
		assert.equal(result.pathname, '/about/');
	});

	test('matches dynamic /blog/42/', () => {
		const result = matchRouteFromUrl('http://gracile/blog/42/', routes);
		assert.ok(result);
		assert.ok(!('redirect' in result));
		assert.equal(result.params['id'], '42');
	});

	test('matches rest /docs/a/b/c/', () => {
		const result = matchRouteFromUrl('http://gracile/docs/a/b/c/', routes);
		assert.ok(result);
		assert.ok(!('redirect' in result));
		assert.equal(result.params['path'], 'a/b/c');
	});

	test('returns null for unmatched URL', () => {
		const result = matchRouteFromUrl('http://gracile/does-not-exist/', routes);
		assert.equal(result, null);
	});

	test('params object is frozen', () => {
		const result = matchRouteFromUrl('http://gracile/blog/42/', routes);
		assert.ok(result);
		assert.ok(!('redirect' in result));
		assert.ok(Object.isFrozen(result.params));
	});
});

describe('matchRouteFromUrl — route priority (first match wins)', () => {
	test('static route wins over dynamic when listed first', () => {
		const routes = buildManifest([
			['/blog/featured/', makeRoute('/blog/featured/')],
			['/blog/{:id}/', makeRoute('/blog/{:id}/', { hasParams: true })],
		]);

		const result = matchRouteFromUrl('http://gracile/blog/featured/', routes);
		assert.ok(result);
		assert.ok(!('redirect' in result));
		// The matched route should be the static one (first in map)
		assert.equal(
			result.foundRoute.filePath,
			routes.get('/blog/featured/')!.filePath,
		);
	});
});

describe('matchRouteFromUrl — edge cases', () => {
	test('empty manifest returns null', () => {
		const routes = buildManifest([]);
		const result = matchRouteFromUrl('http://gracile/', routes);
		assert.equal(result, null);
	});

	test('URL with query string still matches on pathname', () => {
		const routes = buildManifest([['/search/', makeRoute('/search/')]]);
		const result = matchRouteFromUrl('http://gracile/search/?q=hello', routes);
		assert.ok(result);
		assert.ok(!('redirect' in result));
		assert.equal(result.pathname, '/search/');
	});
});

// ── matchRouteFromUrl — trailingSlash ────────────────────────────────

describe("matchRouteFromUrl — trailingSlash: 'always'", () => {
	const routes = buildManifest([
		['/', makeRoute('/')],
		['/about/', makeRoute('/about/')],
		['/blog/{:id}/', makeRoute('/blog/{:id}/', { hasParams: true })],
	]);

	test('redirects /about to /about/ (GET)', () => {
		const result = matchRouteFromUrl('http://gracile/about', routes, 'always');
		assert.ok(result && 'redirect' in result);
		assert.equal(result.redirect, '/about/');
	});

	test('redirects /blog/42 to /blog/42/', () => {
		const result = matchRouteFromUrl(
			'http://gracile/blog/42',
			routes,
			'always',
		);
		assert.ok(result && 'redirect' in result);
		assert.equal(result.redirect, '/blog/42/');
	});

	test('root / is exempt — matches without redirect', () => {
		const result = matchRouteFromUrl('http://gracile/', routes, 'always');
		assert.ok(result && !('redirect' in result));
		assert.equal(result.pathname, '/');
	});

	test('/about/ matches normally', () => {
		const result = matchRouteFromUrl('http://gracile/about/', routes, 'always');
		assert.ok(result && !('redirect' in result));
		assert.equal(result.pathname, '/about/');
	});
});

describe("matchRouteFromUrl — trailingSlash: 'never'", () => {
	// Patterns have no trailing slash (as collectRoutes produces in 'never' mode)
	const neverRoutes = buildManifest([
		['/', makeRoute('/')],
		[
			'/about',
			{
				filePath: 'src/routes/about.ts',
				pattern: new URLPattern('/about', 'http://gracile/'),
				hasParams: false,
				pageAssets: [],
			},
		],
	]);

	test('redirects /about/ to /about', () => {
		const result = matchRouteFromUrl(
			'http://gracile/about/',
			neverRoutes,
			'never',
		);
		assert.ok(result && 'redirect' in result);
		assert.equal(result.redirect, '/about');
	});

	test('root / is exempt — no redirect', () => {
		const result = matchRouteFromUrl('http://gracile/', neverRoutes, 'never');
		assert.ok(result && !('redirect' in result));
		assert.equal(result.pathname, '/');
	});

	test('/about matches normally (no trailing slash)', () => {
		const result = matchRouteFromUrl(
			'http://gracile/about',
			neverRoutes,
			'never',
		);
		assert.ok(result && !('redirect' in result));
		assert.equal(result.pathname, '/about');
	});
});

describe("matchRouteFromUrl — trailingSlash: 'ignore' (default)", () => {
	const routes = buildManifest([
		['/', makeRoute('/')],
		['/about/', makeRoute('/about/')],
		['/blog/{:id}/', makeRoute('/blog/{:id}/', { hasParams: true })],
	]);

	test('/about matches /about/ pattern without redirect', () => {
		const result = matchRouteFromUrl('http://gracile/about', routes, 'ignore');
		assert.ok(result && !('redirect' in result));
		assert.equal(result.pathname, '/about/');
	});

	test('/about/ also matches normally', () => {
		const result = matchRouteFromUrl('http://gracile/about/', routes, 'ignore');
		assert.ok(result && !('redirect' in result));
		assert.equal(result.pathname, '/about/');
	});

	test('/blog/42 matches dynamic route', () => {
		const result = matchRouteFromUrl(
			'http://gracile/blog/42',
			routes,
			'ignore',
		);
		assert.ok(result && !('redirect' in result));
		assert.equal(result.params['id'], '42');
	});

	test('root / matches without redirect', () => {
		const result = matchRouteFromUrl('http://gracile/', routes, 'ignore');
		assert.ok(result && !('redirect' in result));
		assert.equal(result.pathname, '/');
	});
});

// ── extractStaticPaths ───────────────────────────────────────────────

describe('extractStaticPaths — basic behavior', () => {
	test('returns null when route has no params', async () => {
		const routeModule = new RouteModule({});
		const foundRoute = makeRoute('/static/');
		const result = await extractStaticPaths({
			routeModule,
			foundRoute,
			params: {},
			pathname: '/static/',
		});
		assert.equal(result, null);
	});

	test('returns null when routeModule has no staticPaths', async () => {
		const routeModule = new RouteModule({});
		const foundRoute = makeRoute('/blog/{:id}/', { hasParams: true });
		const result = await extractStaticPaths({
			routeModule,
			foundRoute,
			params: { id: '42' },
			pathname: '/blog/42/',
		});
		assert.equal(result, null);
	});

	test('matches params and returns props', async () => {
		const routeModule = new RouteModule({
			staticPaths: () => [
				{ params: { id: 'alpha' }, props: { title: 'Alpha Post' } },
				{ params: { id: 'beta' }, props: { title: 'Beta Post' } },
			],
		});
		const foundRoute = makeRoute('/blog/{:id}/', { hasParams: true });

		const result = await extractStaticPaths({
			routeModule,
			foundRoute,
			params: { id: 'beta' },
			pathname: '/blog/beta/',
		});

		assert.ok(result);
		assert.equal(result.staticPaths.length, 2);
		assert.deepEqual(result.props, { title: 'Beta Post' });
	});

	test('returns null when params do not match any static path', async () => {
		const routeModule = new RouteModule({
			staticPaths: () => [
				{ params: { id: 'alpha' }, props: { title: 'Alpha' } },
			],
		});
		const foundRoute = makeRoute('/blog/{:id}/', { hasParams: true });

		const result = await extractStaticPaths({
			routeModule,
			foundRoute,
			params: { id: 'nonexistent' },
			pathname: '/blog/nonexistent/',
		});

		assert.equal(result, null);
	});

	test('works with async staticPaths', async () => {
		const routeModule = new RouteModule({
			// eslint-disable-next-line @typescript-eslint/require-await
			staticPaths: async () => [
				{ params: { slug: 'hello' }, props: { greeting: 'world' } },
			],
		});
		const foundRoute = makeRoute('/posts/{:slug}/', { hasParams: true });

		const result = await extractStaticPaths({
			routeModule,
			foundRoute,
			params: { slug: 'hello' },
			pathname: '/posts/hello/',
		});

		assert.ok(result);
		assert.deepEqual(result.props, { greeting: 'world' });
	});

	test('returns undefined props when matching path has no props', async () => {
		const routeModule = new RouteModule({
			staticPaths: () => [{ params: { id: 'alpha' }, props: undefined }],
		});
		const foundRoute = makeRoute('/blog/{:id}/', { hasParams: true });

		const result = await extractStaticPaths({
			routeModule,
			foundRoute,
			params: { id: 'alpha' },
			pathname: '/blog/alpha/',
		});

		assert.ok(result);
		assert.equal(result.props, undefined);
	});

	test('multi-param matching requires all params to match', async () => {
		const routeModule = new RouteModule({
			staticPaths: () => [
				{
					params: { category: 'tech', slug: 'vite' },
					props: { title: 'Vite' },
				},
				{
					params: { category: 'tech', slug: 'lit' },
					props: { title: 'Lit' },
				},
			],
		});
		const foundRoute = makeRoute('/blog/{:category}/{:slug}/', {
			hasParams: true,
		});

		// Matching both params
		const result1 = await extractStaticPaths({
			routeModule,
			foundRoute,
			params: { category: 'tech', slug: 'lit' },
			pathname: '/blog/tech/lit/',
		});
		assert.ok(result1);
		assert.deepEqual(result1.props, { title: 'Lit' });

		// Partial match — wrong slug
		const result2 = await extractStaticPaths({
			routeModule,
			foundRoute,
			params: { category: 'tech', slug: 'svelte' },
			pathname: '/blog/tech/svelte/',
		});
		assert.equal(result2, null);
	});
});
