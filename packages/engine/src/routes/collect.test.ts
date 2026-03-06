/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import '../test/init.js';

import { extractRoutePatterns } from './collect.js';

// ── Basic static routes ──────────────────────────────────────────────

describe('extractRoutePatterns — static routes', () => {
	test('root index.ts → /', () => {
		const result = extractRoutePatterns('index.ts');
		assert.equal(result.patternString, '/');
		assert.equal(result.hasParams, false);
	});

	test('(home).ts → / (parenthesized index)', () => {
		const result = extractRoutePatterns('(home).ts');
		assert.equal(result.patternString, '/');
		assert.equal(result.hasParams, false);
	});

	test('about.ts → /about/', () => {
		const result = extractRoutePatterns('about.ts');
		assert.equal(result.patternString, '/about/');
		assert.equal(result.hasParams, false);
	});

	test('nested/deep.ts → /nested/deep/', () => {
		const result = extractRoutePatterns('nested/deep.ts');
		assert.equal(result.patternString, '/nested/deep/');
		assert.equal(result.hasParams, false);
	});

	test('nested/index.ts → /nested/', () => {
		const result = extractRoutePatterns('nested/index.ts');
		assert.equal(result.patternString, '/nested/');
		assert.equal(result.hasParams, false);
	});

	test('nested/(group-name).ts → /nested/', () => {
		const result = extractRoutePatterns('nested/(group-name).ts');
		assert.equal(result.patternString, '/nested/');
		assert.equal(result.hasParams, false);
	});

	test('404.ts → /404/', () => {
		const result = extractRoutePatterns('404.ts');
		assert.equal(result.patternString, '/404/');
		assert.equal(result.hasParams, false);
	});

	test('supports .js extension', () => {
		const result = extractRoutePatterns('about.js');
		assert.equal(result.patternString, '/about/');
	});

	test('supports .jsx extension', () => {
		const result = extractRoutePatterns('about.jsx');
		assert.equal(result.patternString, '/about/');
	});

	test('supports .tsx extension', () => {
		const result = extractRoutePatterns('about.tsx');
		assert.equal(result.patternString, '/about/');
	});

	test('supports .html extension', () => {
		const result = extractRoutePatterns('about.html');
		assert.equal(result.patternString, '/about/');
	});

	test('deeply nested car/bike/boat/train.ts', () => {
		const result = extractRoutePatterns('car/bike/boat/train.ts');
		assert.equal(result.patternString, '/car/bike/boat/train/');
		assert.equal(result.hasParams, false);
	});

	test('deeply nested car/bike/boat/train/red.ts', () => {
		const result = extractRoutePatterns('car/bike/boat/train/red.ts');
		assert.equal(result.patternString, '/car/bike/boat/train/red/');
		assert.equal(result.hasParams, false);
	});
});

// ── Dynamic routes ───────────────────────────────────────────────────

describe('extractRoutePatterns — dynamic [param] routes', () => {
	test('[slug].ts → /{:slug}/', () => {
		const result = extractRoutePatterns('[slug].ts');
		assert.equal(result.patternString, '/{:slug}/');
		assert.equal(result.hasParams, true);
	});

	test('blog/[id].ts → /blog/{:id}/', () => {
		const result = extractRoutePatterns('blog/[id].ts');
		assert.equal(result.patternString, '/blog/{:id}/');
		assert.equal(result.hasParams, true);
	});

	test('[param_test]/index.ts → /{:param_test}/', () => {
		const result = extractRoutePatterns('[param_test]/index.ts');
		assert.equal(result.patternString, '/{:param_test}/');
		assert.equal(result.hasParams, true);
	});

	test('partial dynamic: [arrow]-noon.ts → /{:arrow}-noon/', () => {
		const result = extractRoutePatterns('[arrow]-noon.ts');
		assert.equal(result.patternString, '/{:arrow}-noon/');
		assert.equal(result.hasParams, true);
	});

	test('multi-param: [arrow]-noon-[dive].ts → /{:arrow}-noon-{:dive}/', () => {
		const result = extractRoutePatterns('[arrow]-noon-[dive].ts');
		assert.equal(result.patternString, '/{:arrow}-noon-{:dive}/');
		assert.equal(result.hasParams, true);
	});

	test('nested dynamic: [trustee]/research.ts → /{:trustee}/research/', () => {
		const result = extractRoutePatterns('[trustee]/research.ts');
		assert.equal(result.patternString, '/{:trustee}/research/');
		assert.equal(result.hasParams, true);
	});

	test('[trustee]/index.ts → /{:trustee}/', () => {
		const result = extractRoutePatterns('[trustee]/index.ts');
		assert.equal(result.patternString, '/{:trustee}/');
		assert.equal(result.hasParams, true);
	});

	test('[zebras]-noon/index.ts → /{:zebras}-noon/', () => {
		const result = extractRoutePatterns('[zebras]-noon/index.ts');
		assert.equal(result.patternString, '/{:zebras}-noon/');
		assert.equal(result.hasParams, true);
	});

	test('make/[advance].ts → /make/{:advance}/', () => {
		const result = extractRoutePatterns('make/[advance].ts');
		assert.equal(result.patternString, '/make/{:advance}/');
		assert.equal(result.hasParams, true);
	});
});

// ── Rest/catch-all routes ────────────────────────────────────────────

describe('extractRoutePatterns — rest [...param] routes', () => {
	test('[...slug].ts → /:slug*/', () => {
		const result = extractRoutePatterns('[...slug].ts');
		assert.equal(result.patternString, '/:slug*/');
		assert.equal(result.hasParams, true);
	});

	test('blog/[...slug].ts → /blog/:slug*/', () => {
		const result = extractRoutePatterns('blog/[...slug].ts');
		assert.equal(result.patternString, '/blog/:slug*/');
		assert.equal(result.hasParams, true);
	});

	test('[trustee]/[...verdict].ts → /{:trustee}/:verdict*/', () => {
		const result = extractRoutePatterns('[trustee]/[...verdict].ts');
		assert.equal(result.patternString, '/{:trustee}/:verdict*/');
		assert.equal(result.hasParams, true);
	});

	test('car/bike/boat/[...period].ts → /car/bike/boat/:period*/', () => {
		const result = extractRoutePatterns('car/bike/boat/[...period].ts');
		assert.equal(result.patternString, '/car/bike/boat/:period*/');
		assert.equal(result.hasParams, true);
	});
});

// ── trailingSlash: 'never' ───────────────────────────────────────────

describe("extractRoutePatterns — trailingSlash: 'never'", () => {
	test('static route has no trailing slash', () => {
		const result = extractRoutePatterns('about.ts', 'never');
		assert.equal(result.patternString, '/about');
	});

	test('dynamic route has no trailing slash', () => {
		const result = extractRoutePatterns('[slug].ts', 'never');
		assert.equal(result.patternString, '/{:slug}');
	});

	test('rest route has no trailing slash', () => {
		const result = extractRoutePatterns('[...path].ts', 'never');
		assert.equal(result.patternString, '/:path*');
	});

	test('root index stays as /', () => {
		const result = extractRoutePatterns('index.ts', 'never');
		assert.equal(result.patternString, '/');
	});

	test('nested route has no trailing slash', () => {
		const result = extractRoutePatterns('blog/post.ts', 'never');
		assert.equal(result.patternString, '/blog/post');
	});
});

// ── URLPattern validity ──────────────────────────────────────────────

describe('extractRoutePatterns — generated URLPattern is valid', () => {
	test('pattern matches expected URL for a static route', () => {
		const result = extractRoutePatterns('blog/post.ts');
		const matched = result.pattern.test('http://gracile/blog/post/');
		assert.ok(matched);
	});

	test('pattern matches expected URL for a dynamic route', () => {
		const result = extractRoutePatterns('blog/[id].ts');
		const matched = result.pattern.exec('http://gracile/blog/42/');
		assert.ok(matched);
		assert.equal(matched?.pathname.groups['id'], '42');
	});

	test('pattern matches rest route', () => {
		const result = extractRoutePatterns('docs/[...path].ts');
		const matched = result.pattern.exec('http://gracile/docs/a/b/c/');
		assert.ok(matched);
		assert.equal(matched?.pathname.groups['path'], 'a/b/c');
	});

	test('root pattern matches /', () => {
		const result = extractRoutePatterns('index.ts');
		assert.ok(result.pattern.test('http://gracile/'));
	});
});
