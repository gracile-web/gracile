/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from '../__utils__/fetch.js';
import { createStaticDevServer } from '../__utils__/gracile-server.js';
import { snapshotAssertEqual } from '../__utils__/snapshot.js';

const { address, close, tryOrClose } = await createStaticDevServer({
	project: 'static-site',
});

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '10-svg';

// ---

it('Must have good SVGs', async () => {
	const route = '00-svg';

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

after(async () => close());
