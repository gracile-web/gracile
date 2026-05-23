/**
 * In-package dev Vite config — for working on the shell itself.
 *
 * Real consumers should provide their own `vite.config.ts` calling
 * {@link gracileDocs} directly. This config has no content corpus of its own,
 * so running `vite` here will only succeed if you point `--root` at a
 * consumer (e.g. `vite --root ../../../docs/website`).
 */
import { defineConfig } from 'vite';

import {
	gracileDocs,
	gracileDocsDedupe,
	gracileDocsRollupOptions,
} from './src/vite.ts';

export default defineConfig({
	server: { port: 9899 },
	resolve: { dedupe: gracileDocsDedupe },
	plugins: await gracileDocs({ siteUrl: 'https://gracile.js.org/' }),
	oxc: { target: 'es2023' },
	css: { devSourcemap: true },
	build: {
		sourcemap: true,
		target: 'es2023',
		rollupOptions: gracileDocsRollupOptions,
	},
});
