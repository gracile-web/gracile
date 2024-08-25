// NOTE: UNUSED, maybe never?

// import { defineConfig } from 'vite';
// import terser from '@rollup/plugin-terser';
// import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';

// export default defineConfig({
// 	esbuild: { legalComments: 'none' },
// 	build: {
// 		lib: {
// 			// Could also be a dictionary or array of multiple entry points
// 			entry: './src/dev/custom-overlay/vite-custom-overlay.ts',
// 			name: 'BetterErrors',
// 			// the proper extensions will be added
// 			fileName: 'better-errors',
// 			formats: ['es'],
// 		},

// 		minify: false,
// 		target: 'esnext',
// 		rollupOptions: {
// 			// make sure to externalize deps that shouldn't be bundled
// 			// into your library
// 			external: [],
// 			output: {
// 				dir: 'bundle',
// 			},
// 		},
// 	},

// 	plugins: [
// 		terser({
// 			format: {
// 				comments: false,
// 			},
// 		}),

// 		literalsHtmlCssMinifier(),
// 	],
// });
