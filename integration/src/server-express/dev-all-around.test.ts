/* eslint-disable @typescript-eslint/no-floating-promises */
import { after } from 'node:test';

import { createDynamicDevServer } from '../__utils__/gracile-server.js';
import { common } from './_common.js';

const { /* address, */ close } = await createDynamicDevServer({
	project: 'server-express',
});

// ---

await common('dev', false);

after(async () => close());
