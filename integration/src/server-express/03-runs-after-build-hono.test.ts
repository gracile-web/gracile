/**
 * Hono server integration test.
 *
 * Launches the Hono server (after build) and runs the common test suite.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, it } from 'node:test';

import { launchServer, type ServerProcess } from '../helpers/process.js';
import { common } from './_common.js';

let server: ServerProcess | null = null;

it('runs and execute test suites with HONO', async () => {
	server = await launchServer('server-express', 'hono.js', 9874);
	await common(server.address, 'hono');
});

after(() => {
	server?.kill();
});
