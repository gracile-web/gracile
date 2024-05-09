import type { Server } from 'node:http';

import { logger } from '@gracile/internal-utils/logger';
import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import express, { type RequestHandler } from 'express';
import c from 'picocolors';

import { collectRoutes, routes } from '../routes/collect.js';
import { createViteServer } from '../vite/server.js';
import { createDevRequestHandler } from './request.js';

async function createServer(_hmrPort: number, root = process.cwd()) {
	logger.info(c.green('starting engine…'), {
		timestamp: true,
	});

	setCurrentWorkingDirectory(root);

	const app = express();

	const vite = await createViteServer(root, 'dev');

	app.use(vite.middlewares);

	app.get('/__routes', (req, res) => {
		return res.json([...routes]);
	});

	await collectRoutes(root /* vite */);
	vite.watcher.on('all', (event, _file) => {
		if (['add', 'unlink'].includes(event))
			collectRoutes(root /* , vite */).catch((e) => logger.error(String(e)));
	});

	const handler = createDevRequestHandler(vite);
	/* NOTE: Types are wrong! Should accept an async request handler. */
	app.use('*', handler as RequestHandler);

	return { app, vite };
}

export async function startServer(options: {
	port?: number | undefined;
	root?: string;
	expose?: boolean | undefined;
}) {
	const port = options.port ?? 9090;

	const server = await createServer(port + 1, options.root);

	// NOTE: `0` will auto-alocate a random available port.
	let resultingPort = port;
	let resultingHost: undefined | string;

	const instance: Server = await new Promise((resolve) => {
		const inst = server.app.listen(
			port,
			options.expose ? '0.0.0.0' : '127.0.0.1',
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
