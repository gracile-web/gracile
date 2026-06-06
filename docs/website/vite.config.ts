import { defineConfig } from 'vite';
import { gracileDocs, gracileDocsDedupe } from '@gracile-labs/docs/vite';

const siteUrl = 'https://gracile.js.org/';

const ogImagesColorPalette = {
	primary950: 'rgb(236, 253, 245)',
	primary900: 'rgb(209, 250, 229)',
	primary200: 'rgb(6, 95, 70)',
	background50: 'rgb(19, 61, 87)',
	background200: 'rgb(19, 93, 138)',
	titleShadow: '#00111ad9',
};

export default defineConfig({
	server: { port: 9899 },
	resolve: { dedupe: gracileDocsDedupe },
	plugins: await gracileDocs({
		siteUrl,
		ogImagesGenerator: { colorPalette: ogImagesColorPalette },
	}),
	oxc: { target: 'es2023' },
	css: { devSourcemap: true },
	build: {
		sourcemap: true,
		target: 'es2023',
	},
});
