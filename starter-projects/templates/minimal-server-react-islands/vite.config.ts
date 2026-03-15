/* eslint-disable */
import { gracile } from '@gracile/gracile/plugin';
import { gracileIslands } from '@gracile-labs/islands';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import solid from 'vite-plugin-solid';
// import babel from '@rollup/plugin-babel';
import astro from '@gracile-labs/babel-plugin-jsx-to-literals/astro-to-jsx';
import babel from '@babel/core';

const EXOTIC_EXT = '.astro';

export default defineConfig({
	server: {
		port: 3031,
	},
	preview: {
		port: 3031,
	},

	plugins: [
		react({
			include: ['**/*.react.{js,jsx,ts,tsx}'],
		}),

		preact({
			include: ['**/*.preact.{js,jsx,ts,tsx}'],
			reactAliasesEnabled: false,
			// NOTE: Important!
			babel: {},
		}),

		solid({
			ssr: true,
			include: ['**/*.solid.{js,jsx,ts,tsx}'],
		}),

		vue(),

		svelte(),

		gracile({
			// output: 'server',
			pages: { premises: { expose: true } },

			// litSsr: { renderInfo: { elementRenderers: [IslandElementRenderer] } },

			dev: {
				locals: (_context) => {
					return {
						requestId: crypto.randomUUID(),
						userEmail: 'admin@admin.home.arpa',
					};
				},
			},
		}),

		gracileIslands({
			// islands: [
			// 	'/src/islands/HelloIsland.tsx' /* './src/islands/Counter.tsx' */,
			// ],
		}),

		{
			name: 'vite-plugin-astro-babel',
			enforce: 'pre',
			async transform(code, id) {
				if (!id.endsWith('.astro')) return null;

				const result = await astro(code);

				// try {
				// 	const transformed = await babel.transformAsync(code, {
				// 		filename: id,

				// 		plugins: [astro],
				// 		// sourceMaps: true,
				// 	});

				// 	return {
				// 		code: '', //transformed?.code || '',
				// 		// map: transformed?.map || null,
				// 	};
				// } catch (err) {
				// 	console.error('Error transforming .astro file:', err);
				// }
				return ' ';
			},
		},

		// babel({
		// 	include: ['**/*.astro'],
		// 	extensions: ['.astro'],

		// 	plugins: [astro],
		// }),
	],

	optimizeDeps: {
		// Exclude .astro files from pre-bundling
		exclude: ['*.astro'],
	},
});
