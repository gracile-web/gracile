/* eslint-disable @typescript-eslint/no-floating-promises */
import { it } from 'node:test';

import { build } from '../__utils__/gracile-server.js';
import { compareFolder } from '../__utils__/snapshot.js';

const projectDist = 'server-express/dist';
const projectDistExpected = 'server-express/dist_expected';

// ---

const writeActual = false;

await it('build and compare outputs', async () => {
	await build('server-express', 'server');
	await compareFolder({
		actualPath: projectDist,
		expectedPath: projectDistExpected,
		writeActual,
	});
});
