/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, describe, it } from 'node:test';

import { fetchResource } from './__utils__/fetch.js';
import { createStaticDevServer } from './__utils__/gracile-server.js';
import { snapshotAssertEqual } from './__utils__/snapshot.js';
import { removeLocalPathsInDevAssets } from './__utils__/vite.js';
import { writeActual } from './config.js';

const { address, close } = await createStaticDevServer({
	project: 'static-site',
	port: 4556,
});

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '01-assets';

// ---

// FIXME: the async await stuff is superfluous
// Also, one failing test will close the server and prevent other test to happen,
// which is unwanted.
// More refinements has to be made for all tests using the dev. server.

describe('sibling assets', async () => {
	const route = '00-siblings';

	await it('render the route', async () => {
		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected.html`,
			],
			actualContent: await fetchResource(address, [currentTestRoutes, route]),
			writeActual,
		});
	});

	await it('has route client script', async () => {
		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected-client_ts.ts`,
			],
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(
					address,
					['/src/routes', currentTestRoutes, `${route}.client.ts`],
					{ trailingSlash: false },
				),
			),
			writeActual,
			prettier: false,
		});
	});

	await it('has route css', async () => {
		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected-scss.ts`,
			],
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(
					address,
					['/src/routes', currentTestRoutes, `${route}.scss`],
					{ trailingSlash: false },
				),
			),
			writeActual,
			prettier: false,
		});
	});
});

// // TODO: This test need a bit more work, notably for hydration
// // FIXME: `/@fs/` is wrong. In build and dev.
// // It works outside this test environment otherwise.
// describe('assets with query url', async () => {
// 	const route = '01-import-with-query-url';

// 	await it('render the route with links stylesheets', async () => {
// 		await snapshotAssertEqual({
// 			expectedPath: [
// 				projectRoutes,
// 				currentTestRoutes,
// 				`_${route}_expected.html`,
// 			],
// 			actualContent: await fetchResource(address, [currentTestRoutes, route]),
// 			writeActual,
// 		});
// 	});
// });

describe('assets with query inline', async () => {
	const route = '02-import-with-query-css-inline';

	await it('render the route with inline stylesheets', async () => {
		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected.html`,
			],
			actualContent: await fetchResource(address, [currentTestRoutes, route]),
			writeActual,
		});
	});
});

after(async () => close());
