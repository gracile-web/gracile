import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';
import { type ViteDevServer } from 'vite';

import { collectRoutes } from '../routes/collect.js';
import {
	type ConnectLikeAsyncMiddleware,
	createGracileMiddleware,
} from '../server/request.js';

export async function createHandlers({
	vite,
}: {
	vite: ViteDevServer;
}): Promise<{
	handlers: ConnectLikeAsyncMiddleware;
}> {
	const root = vite.config.root;

	logger.info(c.green('creating handler…'), { timestamp: true });

	const routes = await collectRoutes(root /* vite */);

	vite.watcher.on('all', (event, file) => {
		if (
			file.match(/\/src\/routes\/(.*)\.(ts|js)$/) /*  &&
			['add', 'unlink',''].includes(event) */
		)
			collectRoutes(root, file /* , vite */).catch((e) =>
				logger.error(String(e)),
			);
	});
	//

	// NOTE: Wrong place?
	const serverMode = false;
	const gracile = createGracileMiddleware({ vite, root, serverMode, routes });

	return { handlers: gracile };
}
