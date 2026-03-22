import { rollupOgImagesGenerator } from 'og-images-generator/rollup';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';

/** @type {import('rollup').RollupOptions} */
export default {
	input: 'pages/**/*.html',

	output: { dir: 'dist' },

	external: ['*'],

	plugins: [
		html({
			extractAssets: false,
			flattenOutput: false,
		}),
		//
		rollupOgImagesGenerator(),
	],
};
