/* eslint-disable @typescript-eslint/no-floating-promises */
import { after } from 'node:test';

import { createStaticDevServer } from '../__utils__/gracile-server.js';
// import { createDynamicDevServer } from '../__utils__/gracile-server.js';
import { common } from './_common.js';

const { /* address, */ close } = await createStaticDevServer({
	project: 'server-express',
	port: 9874,
	mode: 'server',
});

// ---

common('dev', true);

after(async () => close());
