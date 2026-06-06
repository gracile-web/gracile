import type { Plugin } from 'rollup';

import type { GenerateOgImagesOptions } from '../generate.js';
import { generateOgImages } from '../generate.js';

export function rollupOgImagesGenerator(
	options?: GenerateOgImagesOptions,
): Plugin {
	return {
		name: 'og-images-generator',

		async closeBundle() {
			await generateOgImages(options);
		},
	} as const;
}
