/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from './__utils__/fetch.js';
import { createStaticDevServer } from './__utils__/gracile-server.js';
import { snapshotAssertEqual } from './__utils__/snapshot.js';
import { removeLocalPathsInDevAssets } from './__utils__/vite.js';

const { address, close, tryOrClose } = await createStaticDevServer({
	project: 'static-site',
});

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '01-assets';

// ---

it('sibling assets', async () => {
	const route = '00-siblings';

	await tryOrClose(async () => {
		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected.html`,
			],
			actualContent: await fetchResource([address, currentTestRoutes, route]),
			writeActual: false,
		});

		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected-client_ts.ts`,
			],
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(
					[address, '/src/routes', currentTestRoutes, `${route}.client.ts`],
					{ trailingSlash: false },
				),
			),
			writeActual: false,
			prettier: false,
		});

		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected-scss.ts`,
			],
			actualContent: removeLocalPathsInDevAssets(
				await fetchResource(
					[address, '/src/routes', currentTestRoutes, `${route}.scss`],
					{ trailingSlash: false },
				),
			),
			writeActual: false,
			prettier: false,
		});
	});
});

after(async () => close());
