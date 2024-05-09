import { type Plugin, type ViteDevServer } from 'vite';

import { renderRoutes } from '../../build/static.js';
import type { GracileConfig } from '../../user-config.js';

export const htmlStaticPages = async (
	viteServerForBuild: ViteDevServer,
	root: string,
	_config: GracileConfig,
) => {
	const inputs = await renderRoutes(viteServerForBuild, root);
	const inputList = inputs.map((input) => input.name);

	return {
		inputList,
		plugin: [
			{
				name: 'gracile-html-inputs',
				apply: 'build',
				enforce: 'pre',

				// config() {
				// 	return {
				// 		build: { rollupOptions: { input: inputList } },
				// 	};
				// },

				// NOTE WORKING. Must be done in the config, before.
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
						// console.log({ id });
						const input = inputs.find((i) => i.name === id);
						return input ? input.absoluteId : null;
					}
					return null;
				},

				load(id) {
					if (id.endsWith('.html')) {
						const content = inputs.find((i) => i.absoluteId === id)?.html;
						if (content) {
							// console.log({ content });
							return content;
						}
					}
					return null;
				},
			} satisfies Plugin,
		],
	};
};
