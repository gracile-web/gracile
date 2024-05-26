import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import { type RequestHandler } from 'express';
import { routeAssets, routeImports, routes } from 'gracile:routes';

import type { CreateHandler } from '../dev/server.js';
import { createRequestHandler } from './request.js';

routes.forEach((route, pattern) => {
	routes.set(pattern, {
		...route,
		pattern: new URLPattern(pattern, 'http://gracile'),
	});
});

export const createHandler: CreateHandler = async ({
	root = process.cwd(),

	// hmrPort,
	// NOTE: We need type parity with the dev. version of this function
	// eslint-disable-next-line @typescript-eslint/require-await
} = {}) => {
	setCurrentWorkingDirectory(root);

	const gracileHandler = createRequestHandler({
		root,
		routes,
		routeImports,
		routeAssets,
		serverMode: true,
	});

	return { handlers: [gracileHandler as RequestHandler], vite: null };
};

export { printNodeHttpServerAddressInfos as printAddressInfos } from './utils.js';
