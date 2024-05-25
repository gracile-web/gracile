import { it } from 'node:test';

import { build } from '../__utils__/gracile-server.js';
import { compareFolder } from '../__utils__/snapshot.js';

const projectDist = 'static-site/dist';
const projectDistExpected = 'static-site/dist_expected';

// ---

await it('build and compare outputs', async () => {
	await build('static-site');

	await compareFolder({
		actualPath: projectDist,
		expectedPath: projectDistExpected,
		writeActual: false,
	});
});
