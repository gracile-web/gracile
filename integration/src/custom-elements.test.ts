/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from './__utils__/fetch.js';
import { createStaticDevServer } from './__utils__/gracile-server.js';
import { snapshotAssertEqual } from './__utils__/snapshot.js';
import { removeLocalPathsInDevAssets } from './__utils__/vite.js';

const { address, close } = await createStaticDevServer({
	project: 'static-site',
	port: 1947,
});

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '03-custom-elements';

const writeActual = false;
// ---

it('render Lit element - Full', async () => {
	const route = '00-lit-full';

	await snapshotAssertEqual({
		expectedPath: [projectRoutes, currentTestRoutes, `_${route}_expected.html`],
		actualContent: await fetchResource(address, [currentTestRoutes, route]),
		writeActual,
	});

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route}_expected-client_ts.ts`,
		],
		actualContent: await fetchResource(
			address,
			['/src/routes', currentTestRoutes, `${route}.client.ts`],
			{ trailingSlash: false },
		),
		writeActual,
		prettier: false,
	});

	await snapshotAssertEqual({
		expectedPath: [
			projectRoutes,
			currentTestRoutes,
			`_${route}_expected-lit_element.ts`,
		],
		actualContent: await fetchResource(
			address,
			['/src/routes', currentTestRoutes, '_lit-element.ts'],
			{ trailingSlash: false },
		).then((r) => removeLocalPathsInDevAssets(r)),
		writeActual,
		prettier: false,
	});
});

after(async () => close());
