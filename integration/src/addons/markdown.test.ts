/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from '../__utils__/fetch.js';
import { createStaticDevServer } from '../__utils__/gracile-server.js';
import { snapshotAssertEqual } from '../__utils__/snapshot.js';

const { address, close } = await createStaticDevServer({
	project: 'static-site',
	port: 18982,
});

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '11-markdown';

// ---

it('MD rendering with marked', async () => {
	const route = '05-preset-marked';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, currentTestRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual: false,
	});
});

after(async () => close());
