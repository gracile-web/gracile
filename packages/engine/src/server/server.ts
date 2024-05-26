import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import { type RequestHandler } from 'express';
import { routeAssets, routeImports, routes } from 'gracile:routes';

import { createRequestHandler } from '../dev/request.js';
import type { HandleWithExpressApp } from '../dev/server.js';

routes.forEach((route, pattern) => {
	routes.set(pattern, {
		...route,
		pattern: new URLPattern(pattern, 'http://gracile'),
	});
});

export const withExpress: HandleWithExpressApp = async ({
	root = process.cwd(),
	// hmrPort,
	app: expressApp,
	// NOTE: We need type parity with the dev. version of this function
	// eslint-disable-next-line @typescript-eslint/require-await
}) => {
	if (!expressApp) throw new Error();
	setCurrentWorkingDirectory(root);

	const handler = createRequestHandler({
		root,
		routes,
		routeImports,
		routeAssets,
		serverMode: true,
	});

	expressApp.use('*', handler as RequestHandler);

	return { app: expressApp, vite: null };
};
