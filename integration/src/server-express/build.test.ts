import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { after, it } from 'node:test';

import { build } from '../__utils__/gracile-server.js';
import { compareFolder } from '../__utils__/snapshot.js';
import { commonAsync } from './_common.js';

const projectDist = 'server-express/dist';
const projectDistExpected = 'server-express/dist_expected';

// ---

let gracileProcess: ChildProcessWithoutNullStreams | null = null;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('build and compare outputs', async () => {
	await build('server-express');

	await compareFolder({
		actualPath: projectDist,
		expectedPath: projectDistExpected,
		writeActual: false,
	});

	await new Promise((resolve) => {
		gracileProcess = spawn(
			'node',
			[
				'-C',
				'preview',
				'__fixtures__/server-express/dist/server/server.js',
				//
			],
			// { cwd: '__fixtures__/server-express' },
		);
		let boostrapped = false;

		gracileProcess.stdout.on('data', (data: unknown) => {
			if (boostrapped) return;
			const d = String(data);
			if (d.includes('3033')) {
				boostrapped = true;

				commonAsync('prod', false)
					.then(() => {
						resolve(null);
					})
					.catch(() => {
						resolve(null);
					});
			}
		});
	});
});

after(() => {
	if (gracileProcess) gracileProcess.kill();
});