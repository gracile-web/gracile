/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { fetchResource } from '../../__utils__/fetch.js';
import { createServer } from '../../__utils__/gracile-server.js';
import { snapshotAssertEqual } from '../../__utils__/snapshot.js';

const { address, close, tryOrClose } = await createServer('static-site');

const projectRoutes = 'static-site/src/routes';
const currentTestRoutes = '11-markdown';

// ---

it('Must have good MD rendering with marked', async () => {
	const route = '05-preset-marked';

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
