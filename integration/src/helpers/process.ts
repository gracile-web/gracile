/**
 * Child-process management for server-mode integration tests.
 *
 * Replaces the old `launch-server.ts` which used "first stdout event" as the
 * readiness signal.  This version uses HTTP polling — much more reliable.
 */

import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { join } from 'node:path';

const FIXTURES_DIR = join(process.cwd(), '__fixtures__');

export interface ServerProcess {
	child: ChildProcessWithoutNullStreams;
	address: string;
	port: number;
	kill: () => void;
}

/**
 * Spawn a server process from a fixture directory and wait until it responds
 * to HTTP requests.
 *
 * @param fixture   Name of the fixture directory (e.g. "server-express")
 * @param entryFile Entry script to run with `node` (e.g. "express.js")
 * @param port      Port the server listens on (must match what's in the script)
 */
export async function launchServer(
	fixture: string,
	entryFile: string,
	port: number,
	options?: { timeoutMs?: number; hostname?: string },
): Promise<ServerProcess> {
	const cwd = join(FIXTURES_DIR, fixture);
	const hostname = options?.hostname ?? 'localhost';
	const timeout = options?.timeoutMs ?? 20_000;
	const address = `http://${hostname}:${port}`;

	const child = spawn('node', [entryFile], {
		cwd,
		stdio: 'pipe',
		env: { ...process.env, NODE_ENV: 'production' },
	});

	// Collect stderr for diagnostics.
	let stderr = '';
	child.stderr.on('data', (data: Buffer) => {
		stderr += data.toString();
	});

	// Also collect stdout for diagnostics.
	let stdout = '';
	child.stdout.on('data', (data: Buffer) => {
		stdout += data.toString();
	});

	// Listen for premature exit.
	let exited = false;
	let exitCode: number | null = null;
	child.on('exit', (code) => {
		exited = true;
		exitCode = code;
	});

	// Poll until the server responds to HTTP.
	const start = Date.now();
	let ready = false;

	while (!ready && Date.now() - start < timeout) {
		if (exited) {
			throw new Error(
				`Server process exited prematurely (code ${exitCode}).\nstdout: ${stdout}\nstderr: ${stderr}`,
			);
		}

		try {
			const r = await fetch(address, { signal: AbortSignal.timeout(1000) });
			// Any response (even 404) means the server is up.
			r.body?.cancel();
			ready = true;
		} catch {
			// Not ready yet.
			await new Promise((r) => setTimeout(r, 250));
		}
	}

	if (!ready) {
		child.kill();
		throw new Error(
			`Server did not become ready within ${timeout}ms.\nstdout: ${stdout}\nstderr: ${stderr}`,
		);
	}

	return {
		child,
		address,
		port,
		kill: () => {
			if (!exited) child.kill();
		},
	};
}
