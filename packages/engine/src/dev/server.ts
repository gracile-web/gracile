import type { Server } from 'node:http';

import { logger } from '@gracile/internal-utils/logger';
import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import express, { type Express, type RequestHandler } from 'express';
import c from 'picocolors';
import { createViteRuntime } from 'vite';

import { collectRoutes, routes } from '../routes/collect.js';
import { createViteServer } from '../vite/server.js';
import { createDevRequestHandler } from './request.js';

export async function handleWithExpressApp({
	root = process.cwd(),
	// hmrPort,
	app,
}: {
	hmrPort?: number;
	root?: string;
	app?: Express;
}) {
	logger.info(c.green('starting engine…'), {
		timestamp: true,
	});

	const isStandalone = Boolean(app);
	const expressApp = app || express();

	if (isStandalone === false) setCurrentWorkingDirectory(root);

	const vite = await createViteServer(root, 'dev');

	expressApp.use(vite.middlewares);

	expressApp.get('/__routes', (req, res) => {
		return res.json([...routes]);
	});

	await collectRoutes(root /* vite */);
	vite.watcher.on('all', (event, _file) => {
		if (['add', 'unlink'].includes(event))
			collectRoutes(root /* , vite */).catch((e) => logger.error(String(e)));
	});

	const handler = createDevRequestHandler(vite);
	// NOTE: Types are wrong! Should accept an async request handler.
	expressApp.use('*', handler as RequestHandler);

	return { app: expressApp, vite };
}

export const DEFAULT_DEV_SERVER_PORT = 9090;

export const DEV_SERVER_EXPOSED_HOST = '0.0.0.0';
export const DEV_SERVER_HOST = '127.0.0.1';
export const RANDOM_PORT = 0;

export async function startServer(options: {
	port: number;
	root: string;
	expose?: boolean | undefined;
}) {
	const server = await handleWithExpressApp({
		// hmrPort: options.port + 1,
		root: options.root,
	});

	// NOTE: `0` will auto-alocate a random available port.
	let resultingPort = options.port;
	let resultingHost: undefined | string;

	const instance: Server = await new Promise((resolve) => {
		const inst = server.app.listen(
			options.port,
			options.expose ? DEV_SERVER_EXPOSED_HOST : DEV_SERVER_HOST,
			() => {
				logger.info(c.green('development server started'), { timestamp: true });
				resolve(inst);
				const addressInfo = inst.address();
				if (typeof addressInfo === 'object' && addressInfo) {
					resultingPort = addressInfo.port;
					// NOTE: this is not ideal. Should have the real bounded IP,
					// like with Vite's `resolvedUrls` (unavailable in middleware mode)
					resultingHost = addressInfo.address;
				}

				logger.info(
					`
${c.dim('┃')} Local    ${c.cyan(`http://localhost:${resultingPort}/`)}
${c.dim('┃')} Network  ${options.expose ? c.cyan(`http://${resultingHost}:${resultingPort}/`) : c.dim(`use ${c.bold('--host')} to expose`)}
`,
				);

				resolve(inst);
			},
		);
	});

	return { port: resultingPort, instance };
}

export const DEFAULT_USER_SERVER_MODULE_ENTRYPOINT = '/src/server';

export async function startUserProvidedServer(options: {
	root: string;
	entrypoint: string;
}) {
	const runtimeServer = await createViteServer(options.root, 'dev');

	const runtime = await createViteRuntime(runtimeServer);
	await runtime.executeEntrypoint(options.entrypoint);
}
