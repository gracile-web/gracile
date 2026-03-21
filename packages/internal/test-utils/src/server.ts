/**
 * Vite dev-server and build lifecycle helpers for integration tests.
 *
 * - Dev servers use port 0 (OS-assigned) to avoid conflicts.
 * - Each dev server gets an isolated Vite cache directory to prevent
 *   esbuild dep-scan race conditions when multiple tests share a fixture.
 */

import './init.js';

import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
	createServer as viteCreateServer,
	createBuilder as viteCreateBuilder,
} from 'vite';

import { resolveFixtures } from './fixtures.js';

export interface TestServer {
	address: string;
	port: number;
	close: () => Promise<void>;
}

/**
 * Start a Vite dev server for a fixture project.
 * Uses port 0 so the OS assigns an available port — no conflicts.
 * Uses a unique cacheDir to isolate dep optimization from parallel runs.
 */
export async function createTestServer(
	fixture: string,
	options?: {
		fixturesDirectory?: string;
		logLevel?: 'info' | 'warn' | 'error' | 'silent';
	},
): Promise<TestServer> {
	const fixturesDirectory = options?.fixturesDirectory ?? resolveFixtures();
	const root = join(fixturesDirectory, fixture);

	const server = await viteCreateServer({
		root,
		server: { port: 0 },
		logLevel: options?.logLevel ?? 'error',
		cacheDir: join(tmpdir(), '.vite-test', randomUUID()),
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
	options?: {
		fixturesDir?: string;
		logLevel?: 'info' | 'warn' | 'error' | 'silent';
	},
): Promise<void> {
	const fixturesDirectory = options?.fixturesDir ?? resolveFixtures();
	const root = join(fixturesDirectory, fixture);

	const builder = await viteCreateBuilder({
		root,
		logLevel: options?.logLevel ?? 'error',
	});
	await builder.buildApp();
}
