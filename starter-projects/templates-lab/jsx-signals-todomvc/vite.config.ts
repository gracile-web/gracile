import { gracile } from '@gracile/gracile/plugin';
import { gracileJsx } from '@gracile-labs/jsx/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3032 },
	preview: { port: 3032 },

	plugins: [
		//
		gracile({ pages: { premises: { expose: true } } }),
		gracileJsx(),
	],

	ssr: {
		noExternal: ['@gracile-labs/functional'], // Force bundling the lib into the SSR output
	},

	resolve: {
		dedupe: [
			'lit',
			'lit-html',
			'@lit-labs/signals',
			'signal-polyfill',
			'@lit-labs/ssr',
			'@lit-labs/ssr-client',
		],
	},
});
