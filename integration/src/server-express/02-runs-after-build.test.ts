import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { after, it } from 'node:test';

import { writeActual } from '../config.js';
import { common } from './_common.js';

// eslint-disable-next-line prefer-const
let gracileProcessExpress: ChildProcessWithoutNullStreams | null = null;
// eslint-disable-next-line prefer-const
let gracileProcessHono: ChildProcessWithoutNullStreams | null = null;

function launch(file: string) {
	let gracileProcess: ChildProcessWithoutNullStreams | null = null;
	return new Promise<ChildProcessWithoutNullStreams | null>(
		(resolve, reject) => {
			// eslint-disable-next-line no-param-reassign
			gracileProcess = spawn(
				'node',
				[file],
				//
				{ cwd: '__fixtures__/server-express' },
			);
			let bootStrapped = false;

			gracileProcess.stdout.on('close', (/* data: unknown */) => {
				reject(new Error(`CLOSED UNEXPECTEDLY!`));
			});
			gracileProcess.stderr.on('data', (data: unknown) => {
				console.log(String(data));
				// resolve(new Error(String(data)));
			});
			gracileProcess.on('error', (err) => {
				console.log(String(err));
				// reject(err);
			});
			gracileProcess.stdout.on('data', (data: unknown) => {
				console.log(String(data));

				if (bootStrapped) return;

				bootStrapped = true;

				common('prod', writeActual)
					.then(() => {
						resolve(gracileProcess);
					})
					.catch(() => {
						resolve(gracileProcess);
					});
			});

			// NOTE: Alternative method (not working with routes that import a SSRed Lit Element)
			// const { instance } = await import(
			// 	'../../__fixtures__/server-express/express.js'
			// );

			// await new Promise((resolve) => {
			// 	setTimeout(() => {
			// 		common('prod', writeActual).then(() => {
			// 			instance.close();
			// 			resolve('');
			// 		});
			// 	}, 1000);
			// });
		},
	);
}
await it('runs and execute test suites with EXPRESS', async () => {
	gracileProcessExpress = await launch('express.js');
});
await it('runs and execute test suites with HONO', async () => {
	gracileProcessHono = await launch('hono.js');
});

after(() => {
	if (gracileProcessExpress) gracileProcessExpress.kill();
	if (gracileProcessHono) gracileProcessHono.kill();
});
