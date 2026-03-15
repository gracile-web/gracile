import { gracile } from '@gracile/gracile/plugin';
import { gracileIslands } from '@gracile-labs/islands';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import solid from 'vite-plugin-solid';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		react({ include: ['**/*.react.{js,jsx,ts,tsx}'] }),

		preact({
			include: ['**/*.preact.{js,jsx,ts,tsx}'],
			reactAliasesEnabled: false,
			babel: {},
		}),

		solid({ ssr: true, include: ['**/*.solid.{js,jsx,ts,tsx}'] }),

		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),

		svelte(),

		gracile(),

		gracileIslands(),
	],
});
