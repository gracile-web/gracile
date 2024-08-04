/* eslint-disable @typescript-eslint/no-floating-promises */
import { it } from 'node:test';

import { build } from '../__utils__/gracile-server.js';
import { compareFolder } from '../__utils__/snapshot.js';

const projectDist = 'static-site/dist';
const projectDistExpected = 'static-site/dist_expected';

const writeActual = false;

// ---

// FIXME: Missing a proper close on crash (like for dev.)

it('build and compare outputs', async () => {
	await build('static-site');

	await compareFolder({
		actualPath: projectDist,
		expectedPath: projectDistExpected,
		writeActual,
	});
});
