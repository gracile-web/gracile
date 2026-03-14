import { applyViteDevServerMiddleware as applyViteDevelopmentServerMiddleware } from './vite-plugin.js';

import { generateOgImages } from 'og-images-generator/api';

/**
 * @param {import("../collect").PathsOptions} [options]
 * @returns {import('astro').AstroIntegration}
 */
export function astroOgImagesGenerator(options) {
	return {
		name: 'og-images-generator',

		hooks: {
			'astro:server:setup': ({ server }) =>
				// @ts-expect-error - Astro's typings dev server drift.
				applyViteDevelopmentServerMiddleware(server),

			'astro:build:done': () => generateOgImages(options),
		},
	};
}
