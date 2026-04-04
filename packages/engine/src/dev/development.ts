import { getLogger } from '@gracile/internal-utils/logger/helpers';
import c from 'picocolors';
import { type ViteDevServer } from 'vite';

import {
	collectRoutes,
	WATCHED_ROUTES_FILES_REGEX,
} from '../routes/collect.js';
import type { RoutesManifest } from '../routes/route.js';
import {
	createGracileHandler,
	type GracileHandler,
} from '../server/request.js';
import type { GracileConfig } from '../user-config.js';
import { invalidateClientRoutesModule } from '../vite/virtual-routes.js';

import { generateRoutesTypings } from './route-typings.js';

function serializeRoutes(routes: RoutesManifest): string {
	return JSON.stringify(
		[...routes.entries()].map(([pattern, route]) => ({
			pattern,
			filePath: route.filePath,
			hasParams: route.hasParams,
			pageAssets: [...route.pageAssets].sort(),
		})),
	);
}

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

	let previousRoutesSnapshot = serializeRoutes(routes);

	const collectAndCodegen = async (): Promise<boolean> => {
		await collectRoutes(
			routes,
			root,
			gracileConfig.routes?.exclude,
			gracileConfig.trailingSlash,
		);

		const nextRoutesSnapshot = serializeRoutes(routes);
		const didRoutesChange = nextRoutesSnapshot !== previousRoutesSnapshot;
		previousRoutesSnapshot = nextRoutesSnapshot;

		if (didRoutesChange) invalidateClientRoutesModule(vite);

		if (gracileConfig.experimental?.generateRoutesTypings)
			await generateRoutesTypings(root, routes).catch((error) =>
				logger.error(String(error)),
			);

		return didRoutesChange;
	};

	await collectAndCodegen();

	let wait: ReturnType<typeof setTimeout>;
	vite.watcher.on('all', (event, file) => {
		if (
			WATCHED_ROUTES_FILES_REGEX.test(file) &&
			['add', 'unlink'].includes(event)
			//
		) {
			clearTimeout(wait);
			wait = setTimeout(() => {
				collectAndCodegen()
					.then((didRoutesChange) => {
						if (didRoutesChange) vite.hot.send('vite:invalidate');
					})
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
