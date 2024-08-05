/* eslint-disable @typescript-eslint/no-floating-promises */
import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import { after, it } from 'node:test';

import { launch } from '../__utils__/launch-server.js';
import { writeActual } from '../config.js';
import { common } from './_common.js';

let gracileProcess: ChildProcessWithoutNullStreams | null = null;

it('runs and execute test suites with EXPRESS', async () => {
	gracileProcess = await launch('express.js', async () => {
		await common('prod', writeActual);
	});
});

after(() => {
	if (gracileProcess) gracileProcess.kill();
});
