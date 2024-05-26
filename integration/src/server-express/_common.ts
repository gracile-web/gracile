/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, it } from 'node:test';

import { fetchResource } from '../__utils__/fetch.js';
import { snapshotAssertEqual } from '../__utils__/snapshot.js';
import { removeLocalPathsInDevAssets } from '../__utils__/vite.js';

const projectRoutes = 'server-express/src/routes';
const currentTestRoutes = '';

const ADDRESS = 'http://localhost:3033';

export async function common(mode: string, writeActual = false) {
	await describe(`load all server routes ${mode}`, async () => {
		const expectedPath = (name: string) => [
			projectRoutes,
			currentTestRoutes,
			`_${name}_${mode}_expected._html`,
		];

		await it('load a static asset from public directory', async () =>
			snapshotAssertEqual({
				expectedPath: expectedPath('favicon.svg'),
				actualContent: await fetchResource([ADDRESS, 'favicon.svg'], {
					trailingSlash: false,
				}),
				writeActual,
			}));
		await it('guard by user server middleware', async () =>
			snapshotAssertEqual({
				expectedPath: expectedPath('private'),
				actualContent: await fetchResource([ADDRESS, 'private']),
				writeActual,
			}));
		await it('load an user server API route', async () =>
			snapshotAssertEqual({
				expectedPath: expectedPath('api'),
				actualContent: await fetchResource([ADDRESS, 'api']),
				writeActual,
			}));
		await it('load a basic page', async () =>
			snapshotAssertEqual({
				expectedPath: expectedPath('about'),
				actualContent: removeLocalPathsInDevAssets(
					await fetchResource([ADDRESS, 'about']),
				),
				writeActual,
			}));
		await it('load homepage with a get query param', async () =>
			snapshotAssertEqual({
				expectedPath: expectedPath('home'),
				actualContent: removeLocalPathsInDevAssets(
					await fetchResource([ADDRESS, '?q=123'], { trailingSlash: false }),
				),
				writeActual,
			}));
	});
}
