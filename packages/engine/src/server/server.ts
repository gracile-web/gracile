import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import { routeAssets, routeImports, routes } from 'gracile:routes';

import type { CreateMiddleware } from '../dev/server.js';
import { createGracileMiddleware } from './request.js';

routes.forEach((route, pattern) => {
	routes.set(pattern, {
		...route,
		pattern: new URLPattern(pattern, 'http://gracile'),
	});
});

export const createHandlers: CreateMiddleware = async ({
	root = process.cwd(),
	// hmrPort,
	// NOTE: We need type parity with the dev. version of this function
	// eslint-disable-next-line @typescript-eslint/require-await
} = {}) => {
	setCurrentWorkingDirectory(root);

	const gracileHandler = createGracileMiddleware({
		root,
		routes,
		routeImports,
		routeAssets,
		serverMode: true,
	});

	return { handlers: [gracileHandler /* as RequestHandler */], vite: null };
};

export { printNodeHttpServerAddressInfos as printAddressInfos } from './utils.js';
