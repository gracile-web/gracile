/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from '../__utils__/fetch.js';
import { createStaticDevServer } from '../__utils__/gracile-server.js';
import { snapshotAssertEqual } from '../__utils__/snapshot.js';
import { writeActual } from '../config.js';

const { address, close } = await createStaticDevServer({
	project: 'static-site',
	port: 5555,
});

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '09-metadata';

// ---

it('metadata', async () => {
	const route = '00-metadata';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, currentTestRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual,
	});
});

after(async () => close());
