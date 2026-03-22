/**
 * Worker-scoped Playwright fixture that starts a Vite dev server for the
 * template matching the current Playwright project name.
 *
 * - Grabs a free OS port first, then passes it to Vite with strictPort.
 * - Isolated Vite cache → safe for parallel workers.
 * - Server starts once per worker, shared across all tests in the project.
 */

import { randomUUID } from 'node:crypto';
import { createServer as createNetServer } from 'node:net';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { test as base } from '@playwright/test';
import { createServer, type ViteDevServer } from 'vite';

export interface TemplateServer {
	address: string;
	port: number;
}

async function getFreePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const srv = createNetServer();
		srv.listen(0, () => {
			const info = srv.address() as AddressInfo;
			srv.close((err) => (err ? reject(err) : resolve(info.port)));
		});
		srv.on('error', reject);
	});
}

export const test = base.extend<
	// eslint-disable-next-line @typescript-eslint/ban-types
	{},
	{ templateServer: TemplateServer }
>({
	templateServer: [
		async ({}, use, workerInfo) => {
			const templateName = workerInfo.project.name;
			const root = join(process.cwd(), 'templates', templateName);
			const port = await getFreePort();

			const server: ViteDevServer = await createServer({
				root,
				server: { port, strictPort: true },
				logLevel: 'error',
				cacheDir: join(tmpdir(), '.vite-starter-test', randomUUID()),
			});

			await server.listen();

			const address = `http://localhost:${port}`;
			console.log(`[${templateName}] Server ready at ${address}`);

			await use({ address, port });
			await server.close();
		},
		{ scope: 'worker' },
	],
});

export { expect } from '@playwright/test';
