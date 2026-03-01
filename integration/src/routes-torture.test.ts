/**
 * Advanced routing "torture test" (static-site dev server).
 *
 * Data-driven test that exercises complex route patterns: catch-all,
 * parameterized, nested, etc. Uses cheerio for structural assertions.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import * as cheerio from 'cheerio';

import { getText } from './helpers/fetch.js';
import { assertBodyIncludes } from './helpers/html.js';
import { createTestServer, type TestServer } from './helpers/server.js';

const ERROR_404 = '404 not found!';

const routes = [
	{ path: '', h1: 'movie (index)' },
	{ path: 'shoot-or', h1: 'Shoot or' },

	{ path: 'popular', h1: '"Popular" (trustee)' },
	{ path: 'formal', h1: '"Formal" (trustee)' },

	{ path: 'formal/research', h1: '"Formal" - Research' },
	{ path: 'popular/research', h1: '"Popular" - Research' },

	{ path: 'formal/guide', h1: '"Formal" - "Guide"' },
	{ path: 'popular/brave', h1: '"Popular" - "Brave"' },

	// DEACTIVATED route patterns
	{ path: 'dance-noon', include: ERROR_404 },
	{ path: 'creation-noon', include: ERROR_404 },

	// DEACTIVATED
	{ path: 'edge-noon-plumber', h1: '"Edge" - "Plumber" (arrow) - (noon)' },

	// DEACTIVATED
	{ path: 'make/best', h1: '"Best" [advance]' },
	{ path: 'make/done', include: ERROR_404 },

	{ path: 'car/bike/boat', h1: 'car / bike / boat - index' },
	{ path: 'car/bike/boat/train', h1: 'car / bike / boat / train' },
	{ path: 'car/bike/boat/zeppelin', h1: 'car / bike / boat / zeppelin' },
	{ path: 'car/bike/boat/train/red', h1: 'car / bike / boat / train / red' },

	{ path: 'car/bike/boat/fog', h1: 'car / bike / boat / "Fog"' },
	{ path: 'car/bike/boat/rain', h1: 'car / bike / boat / "Rain"' },
];

describe('routing torture test (static-site)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site');
	});

	after(async () => {
		await server?.close();
	});

	for (const route of routes) {
		it(`route: ${route.path || '(index)'}`, async () => {
			const html = await getText(
				server.address,
				`/00-routes/05-torture-test/${route.path}`,
			);

			if (route.include) {
				assertBodyIncludes(html, route.include);
			} else if (route.h1) {
				const $ = cheerio.load(html);
				assert.equal($('h1').text(), route.h1);
			}
		});
	}
});
