/**
 * Server-express dev mode test.
 *
 * Starts a Vite dev server for the server-express fixture in server mode,
 * then runs the common test suite against it.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after } from 'node:test';

import { createTestServer } from '../helpers/server.js';
import { common } from './_common.js';

const server = await createTestServer('server-express');

await common(server.address, 'express');

after(async () => {
	await server.close();
});
