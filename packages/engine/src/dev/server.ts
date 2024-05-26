import type { Server } from 'node:http';

import { logger } from '@gracile/internal-utils/logger';
import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import express, { type Express, type RequestHandler } from 'express';
import c from 'picocolors';
import { createViteRuntime, type ViteDevServer } from 'vite';

import { collectRoutes, routes } from '../routes/collect.js';
import { IP_EXPOSED, IP_LOCALHOST } from '../server/env.js';
import { createViteServer } from '../vite/server.js';
import { createRequestHandler } from './request.js';

export type HandleWithExpressApp = typeof withExpress;

export async function withExpress({
	root = process.cwd(),
	// hmrPort,
	app,
	serverMode,
}: {
	hmrPort?: number;
	root?: string;
	app?: Express;
	serverMode?: boolean | undefined;
}): Promise<{
	app: express.Express;
	vite: ViteDevServer | null;
}> {
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

	const handler = createRequestHandler({ vite, root, serverMode });
	// NOTE: Types are wrong! Should accept an async request handler.
	expressApp.use('*', handler as RequestHandler);

	return { app: expressApp, vite };
}

export const DEFAULT_DEV_SERVER_PORT = 9090;

export const DEV_SERVER_EXPOSED_HOST = IP_EXPOSED;
export const DEV_SERVER_HOST = IP_LOCALHOST;

export async function createStandaloneDevServer(options: {
	port: number;
	root: string;
	expose?: boolean | undefined;
}) {
	const server = await withExpress({
		// hmrPort: options.port + 1,
		root: options.root,
		serverMode: false,
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
				logger.info(c.dim(`CWD: ${process.env['__GRACILE_PROJECT_CWD']}`));
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

	// return {
	// 	close: async () => {
	// 		await runtime.destroy();
	// 		await runtimeServer.close();
	// 	},
	// };
}
