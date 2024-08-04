/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from './__utils__/fetch.js';
import { createStaticDevServer } from './__utils__/gracile-server.js';
import { snapshotAssertEqual } from './__utils__/snapshot.js';
import { writeActual } from './config.js';

const { address, close } = await createStaticDevServer({
	project: 'static-site',
	port: 5941,
});

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '04-polyfills';

// ---

// NOTE: Not well tested enough. Should check for inline module content.
// Maybe change the polyfill to `<script src`…
it('client polyfills', async () => {
	const route = '00-polyfills';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, currentTestRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual,
	});
});

after(async () => {
	await close();
	// HACK: This is a bug :/
	// Only with this test, IDK why
	process.exit();
});
