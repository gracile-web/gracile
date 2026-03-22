import { gracile } from '@gracile/gracile/plugin';
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3030 },
	preview: { port: 3030 },

	plugins: [
		gracile({
			output: process.env.DEMO_MODE === 'static' ? 'static' : 'server',
		}),

		// This!
		literalsHtmlCssMinifier(),
	],
});
