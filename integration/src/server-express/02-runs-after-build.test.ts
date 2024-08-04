import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { after, it } from 'node:test';

import { writeActual } from '../config.js';
import { common } from './_common.js';

let gracileProcess: ChildProcessWithoutNullStreams | null = null;

await it('runs and execute test suites', async () => {
	await new Promise((resolve, reject) => {
		gracileProcess = spawn(
			'node',
			['express.js'],
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
					resolve(null);
				})
				.catch(() => {
					resolve(null);
				});
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
});

after(() => {
	if (gracileProcess) gracileProcess.kill();
});
