/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fetchResource } from '../__utils__/fetch.js';
import { snapshotAssertEqual } from '../__utils__/snapshot.js';
import { removeLocalPathsInDevAssets } from '../__utils__/vite.js';
import { api } from './_api.js';

const projectRoutes = 'server-express/src/routes';
const currentTestRoutes = '';

const ADDRESS = 'http://localhost:9874';

async function tests(mode: string, writeActual: boolean) {
	const expectedPath = (name: string) => [
		projectRoutes,
		currentTestRoutes,
		`_${name}_${mode}_expected._html`,
	];

	await it('load a static asset from public directory', async () =>
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
	await it('page has html mime type', async () =>
		fetch(new URL(`${ADDRESS}/about/`, ADDRESS)).then((r) =>
			assert.equal(
				r.headers.get('Content-Type')?.startsWith('text/html'),
				true,
			),
		));

	await it('load the 404 page', async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('404'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['404']),
			),
			writeActual,
		}));

	await it('load a basic page', async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('about'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['about']),
			),
			writeActual,
		}));
	await it('load a basic page with [prerendering]', async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('contact'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['contact']),
			),
			writeActual,
		}));
	await it('load homepage with a get query param', async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('home'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['?q=123'], { trailingSlash: false }),
			),
			writeActual,
		}));
	await it('load a page with various asset loading methods', async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('assets-methods'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['assets-methods']),
			),
			writeActual,
		}));

	await it('load an error page when a route throws', async () =>
		snapshotAssertEqual({
			expectedPath: expectedPath('throws'),
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(ADDRESS, ['throws']),
			),
			writeActual,
		}));
}

export async function common(mode: string, writeActual = false) {
	await describe(`load all server routes ${mode}`, async () => {
		await tests(mode, writeActual);
		await api();
	});
}
// export function commonSync(mode: string, writeActual = false) {
// 	describe(`load all server routes ${mode}`, () => {
// 		tests(mode, writeActual);
// 		api();
// 	});
// }
