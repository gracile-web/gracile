import { gracile } from '@gracile/gracile/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 5189 },
	preview: { port: 5189 },

	plugins: [
		gracile({
			pages: { premises: { expose: true } },
		}),
	],
});
