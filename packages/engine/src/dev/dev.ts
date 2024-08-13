import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';
import { type ViteDevServer } from 'vite';

import { collectRoutes } from '../routes/collect.js';
import {
	createGracileHandler,
	type GracileHandler,
} from '../server/request.js';
import type { GracileConfig } from '../user-config.js';
import { generateRoutesTypings } from './route-typings.js';

export async function createDevHandler({
	vite,
	gracileConfig,
}: {
	vite: ViteDevServer;
	gracileConfig: GracileConfig;
}): Promise<{
	handler: GracileHandler;
}> {
	const root = vite.config.root;

	logger.info(c.dim('\nCreating handler…'), { timestamp: true });

	const routes = await collectRoutes(root, gracileConfig.routes?.exclude);

	if (gracileConfig.experimental?.generateRoutesTypings)
		generateRoutesTypings(root, routes).catch((error) =>
			logger.error(String(error)),
		);

	vite.watcher.on('all', (event, file) => {
		// console.log({ event });
		if (
			file.match(/\/src\/routes\/(.*)\.(ts|js)$/) &&
			['add', 'unlink'].includes(event)
		)
			collectRoutes(root, gracileConfig.routes?.exclude)
				.then(() => {
					vite.hot.send('vite:invalidate');

					if (gracileConfig.experimental?.generateRoutesTypings)
						generateRoutesTypings(root, routes).catch((error) =>
							logger.error(String(error)),
						);
				})
				.catch((e) => logger.error(String(e)));
	});
	//

	// NOTE: Wrong place?
	const serverMode = false;
	const gracile = createGracileHandler({ vite, root, serverMode, routes });

	return { handler: gracile };
}
