import { defineConfig } from 'vite';
import { viteOgImagesGenerator } from 'og-images-generator/vite';

export default defineConfig({
	plugins: [
		//
		viteOgImagesGenerator(),
	],
	build: {
		rollupOptions: {
			input: {
				main: 'index.html',
				astro: 'pages/astro.html',
				lit: 'pages/lit.html',
				vite: 'pages/vite.html',
			},
		},
	},
});
