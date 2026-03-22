import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { createServer } from 'vite';

export const $ = promisify(exec);

export async function createViteTestServer(cwd: string) {
	const server = await createServer({
		root: cwd,
	});

	console.log({ root: server.config.root });

	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	server.listen();

	return { close: () => server.close() };
}

export async function buildAndPreview(cwd: string) {
	await $('pnpm build', { cwd });

	const c = exec('pnpm preview', { cwd });

	// Wait for the preview server to be ready.
	await new Promise<void>((resolve, reject) => {
		const timeout = setTimeout(() => {
			reject(new Error('Preview server did not start within 15s'));
		}, 15_000);

		c.stdout?.on('data', (data: Buffer) => {
			if (String(data).includes('Local:')) {
				clearTimeout(timeout);
				resolve();
			}
		});

		c.on('error', (error) => {
			clearTimeout(timeout);
			reject(error);
		});
	});

	return {
		close: () => c.kill(),
	};
}

const MODE = process.env['MODE'] || 'dev';

export async function createTestServer(url: string) {
	console.log({ MODE });

	const name = new URL(url).pathname.split('/').at(-1)!.replace('.spec.ts', '');
	console.log(`Starting test for ${name}…`);

	const opts = { cwd: `./templates/${name}` };

	if (MODE === 'build') {
		const server = await buildAndPreview(opts.cwd);
		return server;
	}

	const server = await createViteTestServer(opts.cwd);
	return server;
}
