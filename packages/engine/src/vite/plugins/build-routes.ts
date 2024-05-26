import * as cheerio from 'cheerio';
import { type Plugin, type ViteDevServer } from 'vite';

import { renderRoutes } from '../../build/static.js';
import type { GracileConfig } from '../../user-config.js';

export const buildRoutes = async (
	viteServerForBuild: ViteDevServer,
	root: string,
	_config: GracileConfig,
	serverMode = false,
) => {
	const renderedRoutes = await renderRoutes(
		viteServerForBuild,
		serverMode,
		root,
	);
	const inputList = renderedRoutes.map((input) => input.name);

	return {
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
						return input ? input.absoluteId : null;
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
							let alteredContent = file.source.toString();
							const $ = cheerio.load(alteredContent, {
								sourceCodeLocationInfo: true,
							});

							let collectedAssets = '';

							const scriptsAndStyles = [
								// NOTE: Only works in this order.
								// Also, cannot do apparition order
								...$('head link[rel="stylesheet"][href^="/assets/"]'),
								...$('head link[rel="modulepreload"][href^="/assets/"]'),
								...$('head script[type="module"][src^="/assets/"]'),
							];
							scriptsAndStyles.forEach((elem) => {
								const slice = alteredContent.slice(
									elem.sourceCodeLocation?.startOffset,
									elem.sourceCodeLocation?.endOffset,
								);

								collectedAssets += slice;

								alteredContent = alteredContent.replace(slice, '');
							});

							// NOTE: Not used (for now?)
							// file.source = alteredContent;

							const route = renderedRoutes.find((r) => {
								return r.name === fileKey;
							});
							if (route) {
								route.handlerAssets = collectedAssets;
							}

							if (route?.savePrerender !== true)
								// eslint-disable-next-line no-param-reassign, @typescript-eslint/no-dynamic-delete
								delete bundle[fileKey];
						}
					}
				},
			} satisfies Plugin,
		],
	};
};