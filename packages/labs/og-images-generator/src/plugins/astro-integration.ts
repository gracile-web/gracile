import type { AstroIntegration } from 'astro';

import type { PathsOptions } from '../collect.js';
import { generateOgImages } from '../generate.js';

import { applyViteDevServerMiddleware } from './vite-plugin.js';

export function astroOgImagesGenerator(
	options?: PathsOptions,
): AstroIntegration {
	return {
		name: 'og-images-generator',

		hooks: {
			'astro:server:setup': ({ server }) =>
				applyViteDevServerMiddleware(server),

			'astro:build:done': () => generateOgImages(options),
		},
	} as const;
}
