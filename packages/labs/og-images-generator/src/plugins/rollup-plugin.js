import { generateOgImages } from '../generate.js';

/**
 * @param {import("../collect").PathsOptions} [options]
 * @returns {import('rollup').Plugin}
 */
export function rollupOgImagesGenerator(options) {
	return {
		name: 'og-images-generator',

		async closeBundle() {
			await generateOgImages(options);
		},
	};
}
