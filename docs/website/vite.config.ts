import { defineConfig, type PluginOption } from 'vite';
import { viteSvgPlugin } from '@gracile/svg/vite';
import { viteSitemapPlugin } from '@gracile/sitemap/vite';
import { gracile } from '@gracile/gracile/plugin';
import { gracileJsx } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/vite';
import { viteOgImagesGenerator } from 'og-images-generator/vite';
import strip from '@rollup/plugin-strip';
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import { getIcons } from '@iconify/utils';
import { loadCollection } from '@iconify/json';
import { standardCssModules } from 'vite-plugin-standard-css-modules';
// import Inspect from 'vite-plugin-inspect';

import { SITE_URL } from './src/content/global.js';
import { vitePluginMarkdownLit } from './lib/markdown/vite-plugin-markdown-lit.ts';

function iconifyLoader({ iconSet, data }) {
	const virtualModuleId = 'iconify:loader';
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;
	return {
		name: 'gracile-iconify-loader',

		enforce: 'pre',
		// TODO: Proper invalidation!

		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
			return null;
		},

		load(id) {
			if (id === resolvedVirtualModuleId) {
				const set = getIcons(data, iconSet);

				return `
export const iconSet = ${JSON.stringify(set)}
`;
			}

			return null;
		},
	} satisfies PluginOption;
}

const iconSet = [
	'flask',
	'newspaper',
	'toolbox',
	'sticker-duotone',
	'highlighter-duotone',
	'article-duotone',
	'skip-back-duotone',
	'skip-forward-duotone',
	'copy-simple-duotone',
	'queue-duotone',
	'sun-duotone',
	'moon-stars-duotone',
	'lightbulb-duotone',
	'note-pencil-duotone',
	'heartbeat-duotone',
	'discord-logo-duotone',
	'github-logo-duotone',
	'house-duotone',
	'fire-duotone',
	'puzzle-piece-duotone',
	'sphere-duotone',
	'graduation-cap-duotone',
	'books-duotone',
	'book-bookmark-duotone',
	'hands-praying-duotone',
	'seal-question-duotone',
	'files-duotone',
	'file-svg-duotone',
	'file-md-duotone',
	'cooking-pot-duotone',
	'hand-peace-duotone',
	'terminal-duotone',
	'package-duotone',
	'book-open-text-duotone',
	'app-window-duotone',
	'signpost-duotone',
	'code-block-duotone',
	'head-circuit-duotone',
	'gear-duotone',
	'magnifying-glass-duotone',
	'palette-duotone',
	'play-duotone',
	'info-duotone',
	'feather-duotone',
	'lightning-duotone',
	'scroll-duotone',
	'rocket-launch-duotone',
];

export default defineConfig({
	server: { port: 9899 },

	resolve: {
		dedupe: [
			'lit',
			'lit-html',
			'@lit-labs/signals',
			'@lit-labs/ssr',
			'@lit-labs/ssr-client',
		],
	},

	plugins: [
		iconifyLoader({
			iconSet,
			data: await loadCollection('./node_modules/@iconify/json/json/ph.json'),
		}),
		gracile({
			pages: { premises: { expose: true } },
		}),
		viteSvgPlugin(),
		vitePluginMarkdownLit(),

		viteSitemapPlugin({ siteUrl: SITE_URL }),

		// FIXME: When saving vite config, this plugin hangs. Need upstream fix.
		viteOgImagesGenerator({
			additionalPatterns: ['!**/__*'],
		}),

		gracileJsx(),

		standardCssModules({ outputMode: 'CSSResult' }),

		literalsHtmlCssMinifier(),

		// FIXME: Breaks HMR
		// Inspect(),
	],

	esbuild: {
		target: 'es2023',
	},
	oxc: {
		target: 'es2023',
	},

	css: { devSourcemap: true },

	build: {
		sourcemap: true,
		target: 'es2023',
		rollupOptions: {
			plugins: [strip({})],
			// output: {
			// 	// HACK: Temporary fix.
			// 	// @lit-labs/ssr-client/lit-element-hydrate-support.js sets globalThis.litElementHydrateSupport
			// 	// lit-element.js checks globalThis.litElementHydrateSupport?.({LitElement}) during class initialization
			// 	// The global must be set before LitElement class is defined
			// 	// With Vite 7 (Rollup): The chunking preserves this ordering — the hydration support assignment ends up before or with the LitElement definition.
			// 	// With Vite 8 (Rolldown): The hydration support code gets placed in the router chunk, while LitElement ends up in the decorators chunk. Since router depends on decorators, the LitElement class initializes first (calling globalThis.litElementHydrateSupport → undefined), then the router sets it — too late.
			// 	manualChunks(id) {
			// 		if (id.includes('lit-element-hydrate-support')) return 'lit-core';
			// 		if (id.includes('lit-element') || id.includes('reactive-element'))
			// 			return 'lit-core';

			// 		return null;
			// 	},
			// },
		},
	},
});
