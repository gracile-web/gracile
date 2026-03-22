/**
 * Express server integration test.
 *
 * Builds the server-express fixture, launches the Express server,
 * and runs the common test suite against it.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import {
	launchServer,
	type ServerProcess,
} from '@gracile/internal-test-utils/process';
import { common } from './_common.js';

let server: ServerProcess | null = null;

it('runs and execute test suites with EXPRESS', async () => {
	server = await launchServer('server-express', 'express.js', 9874);
	await common(server.address, 'express');
});

after(() => {
	server?.kill();
});
