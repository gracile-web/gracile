import { defineConfig } from 'vite';
import {
	gracileDocs,
	gracileDocsDedupe,
	gracileDocsRollupOptions,
} from '@gracile-labs/docs/vite';

const siteUrl = 'https://gracile.js.org/';

export default defineConfig({
	server: { port: 9899 },
	resolve: { dedupe: gracileDocsDedupe },
	plugins: await gracileDocs({ siteUrl }),
	oxc: { target: 'es2023' },
	css: { devSourcemap: true },
	build: {
		sourcemap: true,
		target: 'es2023',
		rollupOptions: gracileDocsRollupOptions,
	},
});
