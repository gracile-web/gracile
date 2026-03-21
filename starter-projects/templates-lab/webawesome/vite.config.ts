import { gracile } from '@gracile/gracile/plugin';
import { gracileJsx } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3033 },

	plugins: [
		//
		gracile({ pages: { premises: { expose: true } } }),
		gracileJsx(),
	],
});
