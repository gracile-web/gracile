/**
 * Vite dev-server and build lifecycle helpers for integration tests.
 *
 * - Dev servers use port 0 (OS-assigned) to avoid conflicts.
 * - Build runs Vite in the fixture root directory.
 */

import './init.js';

import type { AddressInfo } from 'node:net';
import { join } from 'node:path';

import { createServer as viteCreateServer, build as viteBuild } from 'vite';

const FIXTURES_DIR = join(process.cwd(), '__fixtures__');

export interface TestServer {
	address: string;
	port: number;
	close: () => Promise<void>;
}

/**
 * Start a Vite dev server for a fixture project.
 * Uses port 0 so the OS assigns an available port — no conflicts.
 */
export async function createTestServer(
	fixture: string,
	options?: { logLevel?: 'info' | 'warn' | 'error' | 'silent' },
): Promise<TestServer> {
	const root = join(FIXTURES_DIR, fixture);

	const server = await viteCreateServer({
		root,
		server: { port: 0 },
		logLevel: options?.logLevel ?? 'error',
	});

	await server.listen();

	const info = server.httpServer?.address() as AddressInfo | null;
	if (!info?.port) {
		await server.close();
		throw new Error(
			`Vite dev server failed to bind a port for fixture "${fixture}"`,
		);
	}

	return {
		address: `http://localhost:${info.port}`,
		port: info.port,
		close: () => server.close(),
	};
}

/**
 * Run a Vite production build for a fixture project.
 */
export async function buildFixture(
	fixture: string,
	options?: { logLevel?: 'info' | 'warn' | 'error' | 'silent' },
): Promise<void> {
	const root = join(FIXTURES_DIR, fixture);
	await viteBuild({
		root,
		logLevel: options?.logLevel ?? 'error',
	});
}
