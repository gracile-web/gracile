/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from './__utils__/fetch.js';
import { createStaticDevServer } from './__utils__/gracile-server.js';
import { snapshotAssertEqual } from './__utils__/snapshot.js';

const { address, close, tryOrClose } = await createStaticDevServer({
	project: 'static-site',
});

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '00-routes';

// ---

it('return basic route', async () => {
	const route = '00-basic';

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
	});
});

//

it('return 1 param static route', async () => {
	const route = '01-param';

	await tryOrClose(async () => {
		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected-omega.html`,
			],
			actualContent: await fetchResource([
				address,
				currentTestRoutes,
				route,
				'omega',
			]),
			writeActual: false,
		});

		await snapshotAssertEqual({
			expectedPath: [
				projectRoutes,
				currentTestRoutes,
				`_${route}_expected-jupiter.html`,
			],
			actualContent: await fetchResource([
				address,
				currentTestRoutes,
				route,
				'jupiter',
			]),
			writeActual: false,
		});
	});
});

after(async () => close());
