import { createFilter, type ViteDevServer } from 'vite';

import {
	renderRoutes,
	type RenderedRouteDefinition,
} from '../routes/render.js';
import type { RoutesManifest } from '../routes/route.js';
import type { GracileConfig } from '../user-config.js';

function stripPremises(input: string): string {
	return input
		.replace(/index\.html$/, '__index.doc.html')
		.replace(/404\.html$/, '__404.doc.html')
		.replace(/500\.html$/, '__500.doc.html');
}

export const buildRoutes = async ({
	routes,
	viteServerForBuild,
	root,
	gracileConfig,
	serverMode = false,
}: {
	routes: RoutesManifest;
	viteServerForBuild: ViteDevServer;
	root: string;
	gracileConfig: GracileConfig;
	serverMode?: boolean;
}): Promise<{
	routes: RoutesManifest;
	renderedRoutes: RenderedRouteDefinition[];
	inputList: string[];
}> => {
	const { renderedRoutes } = await renderRoutes({
		vite: viteServerForBuild,
		serverMode,
		root,
		gracileConfig,
		routes,
	});

	const inputList = renderedRoutes
		.filter((index) => index.html)
		.map((input) => input.name);

	const premisesFilter = gracileConfig.pages?.premises?.expose
		? createFilter(
				gracileConfig.pages.premises.include,
				gracileConfig.pages.premises.exclude,
			)
		: null;

	if (gracileConfig.pages?.premises?.expose && premisesFilter) {
		// eslint-disable-next-line unicorn/no-array-for-each
		inputList.forEach((input) => {
			if (premisesFilter(input) === false) return;

			inputList.push(stripPremises(input));
		});
	}

	return {
		routes,
		renderedRoutes,
		inputList,
	};
};
