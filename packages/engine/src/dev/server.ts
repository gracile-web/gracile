import type { Server } from 'node:http';

import { logger } from '@gracile/internal-utils/logger';
import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import express from 'express';
import c from 'picocolors';
import { createViteRuntime, type ViteDevServer } from 'vite';

import { collectRoutes } from '../routes/collect.js';
import { IP_EXPOSED, IP_LOCALHOST } from '../server/env.js';
import {
	type ConnectLikeAsyncMiddleware,
	createGracileMiddleware,
} from '../server/request.js';
import { createViteServer } from '../vite/server.js';

export type CreateMiddleware = typeof createHandlers;

export async function createHandlers({
	root = process.cwd(),
	// hmrPort,

	isStandalone,
}: {
	isStandalone?: boolean;
	hmrPort?: number;
	root?: string;
} = {}): Promise<{
	vite: ViteDevServer | null;
	handlers: ConnectLikeAsyncMiddleware[];
}> {
	if (isStandalone !== true) setCurrentWorkingDirectory(root);

	logger.info(c.green('creating handler…'), {
		timestamp: true,
	});

	const { vite, gracileConfig } = await createViteServer(root, 'dev');

	const routes = await collectRoutes(root /* vite */);

	const debugRoutes: ConnectLikeAsyncMiddleware = (req, res, next) => {
		if (req.url !== '__routes') return next();
		res.setHeader('content-type', 'application/json');
		return res.end(JSON.stringify([...routes]));
	};

	vite.watcher.on('all', (event, _file) => {
		if (['add', 'unlink'].includes(event))
			collectRoutes(root /* , vite */).catch((e) => logger.error(String(e)));
	});

	const serverMode = gracileConfig?.output === 'server';
	const gracile = createGracileMiddleware({ vite, root, serverMode, routes });

	return { handlers: [debugRoutes, vite.middlewares, gracile], vite };
}

export const DEFAULT_DEV_SERVER_PORT = 9090;

export const DEV_SERVER_EXPOSED_HOST = IP_EXPOSED;
export const DEV_SERVER_HOST = IP_LOCALHOST;

export async function createStandaloneDevServer(options: {
	port: number;
	root: string;
	expose?: boolean | undefined;
}) {
	const { handlers: handler } = await createHandlers({
		// hmrPort: options.port + 1,
		root: options.root,
	});

	// NOTE: `0` will auto-alocate a random available port.
	let resultingPort = options.port;
	let resultingHost: undefined | string;

	const expressApp = express();

	expressApp.use(handler);

	const instance: Server = await new Promise((resolve) => {
		const inst = expressApp.listen(
			options.port,
			options.expose ? DEV_SERVER_EXPOSED_HOST : DEV_SERVER_HOST,
			() => {
				logger.info(c.green('development server started'), {
					timestamp: true,
				});
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
	const { vite: runtimeServer } = await createViteServer(options.root, 'dev');

	const runtime = await createViteRuntime(runtimeServer);
	await runtime.executeEntrypoint(options.entrypoint);

	// return {
	// 	close: async () => {
	// 		await runtime.destroy();
	// 		await runtimeServer.close();
	// 	},
	// };
}

export { printNodeHttpServerAddressInfos as printAddressInfos } from '../server/utils.js';
