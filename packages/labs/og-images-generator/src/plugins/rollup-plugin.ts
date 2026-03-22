import type { Plugin } from 'rollup';

import type { PathsOptions } from '../collect.js';
import { generateOgImages } from '../generate.js';

export function rollupOgImagesGenerator(options?: PathsOptions): Plugin {
	return {
		name: 'og-images-generator',

		async closeBundle() {
			await generateOgImages(options);
		},
	};
}
