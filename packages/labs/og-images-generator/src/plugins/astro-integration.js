import { generateOgImages } from 'og-images-generator/api';
import { applyViteDevServerMiddleware } from './vite-plugin.js';

/**
 * @param {import("../collect").PathsOptions} [options]
 * @returns {import('astro').AstroIntegration}
 */
export function astroOgImagesGenerator(options) {
	return {
		name: 'og-images-generator',

		hooks: {
			'astro:server:setup': ({ server }) =>
				applyViteDevServerMiddleware(server),

			'astro:build:done': () => generateOgImages(options),
		},
	};
}
