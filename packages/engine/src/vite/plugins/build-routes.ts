import { type Plugin, type ViteDevServer } from 'vite';

import { renderRoutes } from '../../build/static.js';
import {
	REGEX_TAG_LINK,
	REGEX_TAG_SCRIPT,
} from '../../render/route-template.js';
import type { GracileConfig } from '../../user-config.js';

export const buildRoutes = async ({
	viteServerForBuild,
	root,
	_config,
	serverMode = false,
}: {
	viteServerForBuild: ViteDevServer;
	root: string;
	_config: GracileConfig;
	serverMode?: boolean;
}) => {
	const { renderedRoutes, routes } = await renderRoutes({
		vite: viteServerForBuild,
		serverMode,
		root,
	});

	const inputList = renderedRoutes
		.filter((i) => i.html)
		.map((input) => input.name);

	return {
		routes,
		renderedRoutes,
		inputList,
		plugin: [
			{
				name: 'gracile-html-routes',
				apply: 'build',
				enforce: 'pre',

				// config() {
				// 	return {
				// 		build: { rollupOptions: { input: inputList } },
				// 	};
				// },

				// NOTE: NOT WORKING. Must be done in the config, before.
				// config: {
				// 	order: 'pre',
				// 	handler(config) {
				// 		if (config.build?.rollupOptions) {
				// 			// eslint-disable-next-line no-param-reassign
				// 		}
				// 		// eslint-disable-next-line no-param-reassign
				// 		config.build ||= {};
				// 		// eslint-disable-next-line no-param-reassign
				// 		config.build.rollupOptions ||= {};
				// 		// eslint-disable-next-line no-param-reassign
				// 		config.build.rollupOptions.input = inputList;

				// 		return {
				// 			build: { rollupOptions: { input: inputList } },
				// 		};
				// 		// return
				// 	},
				// },

				resolveId(id) {
					if (id.endsWith('.html')) {
						const input = renderedRoutes.find((i) => i.name === id);

						if (input) return input.absoluteId;
					}
					return null;
				},

				load(id) {
					if (id.endsWith('.html')) {
						const content = renderedRoutes.find(
							(i) => i.absoluteId === id,
						)?.html;

						if (content) return content;
					}
					return null;
				},
			} satisfies Plugin,

			{
				name: 'gracile-collect-handler-assets',
				enforce: 'post',

				generateBundle(_, bundle) {
					if (serverMode === false) return;
					// eslint-disable-next-line no-restricted-syntax, guard-for-in
					for (const fileKey in bundle) {
						const file = bundle[fileKey];

						if (fileKey.endsWith('.html') && file && 'source' in file) {
							const source = file.source.toString();

							const collectedAssets = [
								...[...source.matchAll(REGEX_TAG_SCRIPT)]
									.map((v) => v[0])
									// NOTE: Too brittle
									.filter((v) => v.includes(`type="module"`)),
								...[...source.matchAll(REGEX_TAG_LINK)]
									.map((v) => v[0])
									// NOTE: Too brittle
									.filter((v) => /rel="(stylesheet|modulepreload)"/.test(v)),
							].join('\n');

							// NOTE: Not used (for now?)
							// file.source = alteredContent;

							const route = renderedRoutes.find((r) => {
								return r.name === fileKey;
							});
							if (route) route.handlerAssets = collectedAssets;

							if (route?.savePrerender !== true) {
								// eslint-disable-next-line no-param-reassign, @typescript-eslint/no-dynamic-delete
								delete bundle[fileKey];
								if (route?.html) route.html = null;
							}
						}
					}
				},
			} satisfies Plugin,
		],
	};
};
