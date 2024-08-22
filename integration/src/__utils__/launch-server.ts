/* eslint-disable no-console */
import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';

export function launch(file: string, callback: () => Promise<unknown>) {
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

				callback()
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
