import { gracile } from '@gracile/gracile/plugin';
import { gracileIslands } from '@gracile-labs/islands';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3030 },
	preview: { port: 3030 },

	plugins: [
		react({ include: ['**/*.react.{js,jsx,ts,tsx}'] }),

		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),

		gracile(),

		gracileIslands(),
	],
});
