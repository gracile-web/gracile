/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fetchResource } from '../__utils__/fetch.js';
import { checkResponse } from '../__utils__/fetch-utils.js';
import { removeLitParts, snapshotAssertEqual } from '../__utils__/snapshot.js';
import { removeLocalPathsInDevAssets } from '../__utils__/vite.js';
import { api } from './_api.js';

const projectRoutes = 'server-express/src/routes';
const currentTestRoutes = '';

const ADDRESS = 'http://localhost:9874';

async function tests(mode: string, item: string, writeActual: boolean) {
	const expectedPath = (name: string) => [
		projectRoutes,
		currentTestRoutes,
		`_${name}_${mode}_expected._html`,
	];

	await it(`load a static asset from public directory - ${item}`, async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('favicon.svg'),
			actualContent: await fetchResource(ADDRESS, ['favicon.svg'], {
				trailingSlash: false,
			}),
			writeActual,
		}));

	// NOTE: Reactivate when Vite Environment API will be setup
	// await it('guard by user server middleware', async () =>
	// 	snapshotAssertEqual({
	// 		expectedPath: expectedPath('private'),
	// 		actualContent: await fetchResource(ADDRESS, ['private']),
	// 		writeActual,
	// 	}));
	// await it('load an user server API route', async () =>
	// 	snapshotAssertEqual({
	// 		expectedPath: expectedPath('api'),
	// 		actualContent: await fetchResource(ADDRESS, ['api']),
	// 		writeActual,
	// 	}));
	await it(`page has html mime type - ${item}`, async () =>
		fetch(new URL(`${ADDRESS}/about/`, ADDRESS)).then((r) =>
			assert.equal(
				r.headers.get('Content-Type')?.startsWith('text/html'),
				true,
			),
		));

	await it(`load the 404 page - ${item}`, async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('404'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['404']),
			),
			writeActual,
		}));

	await it(`load a basic page - ${item}`, async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('about'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['about']),
			),
			writeActual,
		}));
	await it('load a basic page with [prerenderin- g ]+item', async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('contact'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['contact']),
			),
			writeActual,
		}));
	await it(`load homepage with a get query param - ${item}`, async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('home'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['?q=123'], { trailingSlash: false }),
			),
			writeActual,
		}));
	await it(`load a page with various asset loading methods - ${item}`, async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('assets-methods'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['assets-methods']),
			),
			writeActual,
		}));

	await it(`should forward response init when returning an html template via GET - ${item}`, async () =>
		checkResponse(
			fetch(new URL(`/response-init/`, ADDRESS), { headers: { hey: '__abc' } }),
			{
				headers: { bar: 'baz', daz: 'doze' },
				status: 210,
				// NOTE: Hono doesn't support custom status text
				// statusText: 'Hi there__abc',
			},
		));
	await it(`should forward response init when returning an html template via POST - ${item}`, async () =>
		checkResponse(
			fetch(new URL(`/response-init/`, ADDRESS), {
				method: 'POST',
				headers: { hey: '__oi' },
			}),
			{
				headers: { azz: 'ozz', dizz: 'duzz' },
				status: 211,
				// NOTE: Hono doesn't support custom status text
				// statusText: 'Ola__oi',
			},
		));
	// TODO: Test with "accept: json" when implemented

	await it(`load an error page when a route throws - ${item}`, async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('throws'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['throws']),
			),
			writeActual,
		}));

	// TODO: Proper test that works with Hono. For now,
	// implemented error handling is very basic with it.
	// It doesn't handle stream abortion as gracefully as with Express.
	if (item === 'express')
		await it(`should return a route with failing template - ${item}`, async () =>
			snapshotAssertEqual({
				expectedPath: expectedPath('template-failure'),
				actualContent: removeLocalPathsInDevAssets(
					removeLitParts(await fetchResource(ADDRESS, ['template-failure'])),
				),
				writeActual,
			}));
}

export async function common(mode: string, item: string, writeActual = false) {
	await describe(`load all server routes ${mode} - ${item}`, async () => {
		await tests(mode, item, writeActual);
		await api(item);
	});
}
// export function commonSync(mode: string, writeActual = false) {
// 	describe(`load all server routes ${mode}`, () => {
// 		tests(mode, writeActual);
// 		api();
// 	});
// }
