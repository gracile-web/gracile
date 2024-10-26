import { getLogger } from '@gracile/internal-utils/logger/helpers';
import c from 'picocolors';
import { type ViteDevServer } from 'vite';

import { collectRoutes, WATCHED_FILES_REGEX } from '../routes/collect.js';
import type { RoutesManifest } from '../routes/route.js';
import {
	createGracileHandler,
	type GracileHandler,
} from '../server/request.js';
import type { GracileConfig } from '../user-config.js';

import { generateRoutesTypings } from './route-typings.js';

export async function createDevelopmentHandler({
	routes,
	vite,
	gracileConfig,
}: {
	routes: RoutesManifest;
	vite: ViteDevServer;
	gracileConfig: GracileConfig;
}): Promise<{
	handler: GracileHandler;
	routes: RoutesManifest;
}> {
	const logger = getLogger();

	const root = vite.config.root;

	logger.info('');
	logger.info(c.dim('Creating the request handler…'), { timestamp: true });

	const collectAndCodegen = async () => {
		await collectRoutes(routes, root, gracileConfig.routes?.exclude);

		if (gracileConfig.experimental?.generateRoutesTypings)
			await generateRoutesTypings(root, routes).catch((error) =>
				logger.error(String(error)),
			);
	};

	await collectAndCodegen();

	let wait: ReturnType<typeof setTimeout>;
	vite.watcher.on('all', (event, file) => {
		if (
			WATCHED_FILES_REGEX.test(file) &&
			['add', 'unlink'].includes(event)
			//
		) {
			clearTimeout(wait);
			wait = setTimeout(() => {
				collectAndCodegen()
					.then(() => vite.hot.send('vite:invalidate'))
					.catch((error) => logger.error(String(error)));
			}, 100);
		}
	});

	// ---

	// NOTE: Wrong place?
	const serverMode = false;
	const gracile = createGracileHandler({
		vite,
		root,
		serverMode,
		routes,
		gracileConfig,
	});

	return { handler: gracile, routes };
}
