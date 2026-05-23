import { readFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';

import type { PluginOption } from 'vite';
import { gracile } from '@gracile/gracile/plugin';
import { viteSvgPlugin } from '@gracile/svg/vite';
import { viteSitemapPlugin } from '@gracile/sitemap/vite';
import { gracileJsx } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/vite';
import { viteOgImagesGenerator } from 'og-images-generator/vite';
import strip from '@rollup/plugin-strip';
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import { getIcons } from '@iconify/utils';
import { loadCollection } from '@iconify/json';
import { standardCssModules } from 'vite-plugin-standard-css-modules';

import { vitePluginMarkdownLit } from '../lib/markdown/vite-plugin-markdown-lit.ts';

const HERE = import.meta.dirname;
const PKG_ROOT = dirname(HERE); // → packages/labs/docs
const ROUTES_DIR = join(HERE, 'routes');
const PAGEFIND_PUBLIC_DIR = join(PKG_ROOT, 'public', 'pagefind');

const PAGEFIND_MIME_TYPES: Record<string, string> = {
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.pf_meta': 'application/octet-stream',
	'.pagefind': 'application/wasm',
};

/**
 * Convert an absolute filesystem path to Vite's `/@fs/` format.
 * The engine's `injectSiblingAssets` prepends a `/`, so we supply `@fs<abs>`
 * which becomes `/@fs<abs>` — Vite's out-of-root file serving prefix.
 */
function toFsUrl(absPath: string): string {
	return `@fs${absPath}`;
}

/**
 * Options for the {@link gracileDocs} Vite preset.
 *
 * The shell expects the consumer to provide their brand/content modules at:
 * - `/src/content/global.js` — brand constants (SITE_TITLE, SITE_URL, …)
 * - `/src/content/feature-list.ts` — home-page feature grid
 * - `/src/content/content.ts` — markdown glob aggregator
 * - `/src/content/docs/**\/*.md` — documentation markdown corpus
 * - `/src/content/blog/**\/*.md` — blog markdown corpus (optional)
 */
export interface GracileDocsOptions {
	/**
	 * Public URL of the consumer site (used by the sitemap plugin).
	 * Should match `SITE_URL` exported from the consumer's `/src/content/global.js`.
	 */
	siteUrl: string;

	/**
	 * Iconify icon names to bundle from the Phosphor set.
	 * Defaults to the full Gracile docs icon set.
	 */
	iconSet?: string[];

	/**
	 * Extra Gracile config to merge on top of the shell defaults.
	 */
	gracile?: Parameters<typeof gracile>[0];
}

const DEFAULT_ICON_SET = [
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

function iconifyLoader({
	iconSet,
	data,
}: {
	iconSet: string[];
	data: Parameters<typeof getIcons>[0];
}): PluginOption {
	const virtualModuleId = 'iconify:loader';
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;
	return {
		name: 'gracile-docs:iconify-loader',
		enforce: 'pre',
		resolveId(id) {
			if (id === virtualModuleId) return resolvedVirtualModuleId;
			return null;
		},
		load(id) {
			if (id === resolvedVirtualModuleId) {
				const set = getIcons(data, iconSet);
				return `export const iconSet = ${JSON.stringify(set)}`;
			}
			return null;
		},
	};
}

/**
 * Vite alias resolver that wires the lib's `@gracile-docs/*` imports
 * to the consumer's `/src/content/*` files.
 *
 * The actual resolution happens against the Vite project root, so the
 * consumer just needs to keep these files at the canonical location.
 */
function shellContentAliasPlugin(): PluginOption {
	const map: Record<string, string> = {
		'@gracile-docs/site': '/src/content/global.js',
		'@gracile-docs/feature-list': '/src/content/feature-list.ts',
		'@gracile-docs/content': '/src/content/content.ts',
	};
	return {
		name: 'gracile-docs:content-alias',
		enforce: 'pre',
		config(userConfig) {
			const consumerRoot = userConfig.root ?? process.cwd();
			// Allow Vite to serve lib files outside the consumer root via /@fs/.
			// Also force a single copy of Lit regardless of which node_modules it
			// is resolved from (lib vs consumer).
			return {
				server: { fs: { allow: [consumerRoot, PKG_ROOT] } },
				resolve: {
					dedupe: [
						'lit',
						'lit-html',
						'@lit/reactive-element',
						'@lit-labs/signals',
						'@lit-labs/ssr',
						'@lit-labs/ssr-client',
					],
				},
				optimizeDeps: {
					exclude: ['lit', 'lit-html', '@lit/reactive-element'],
				},
			};
		},
		async resolveId(id) {
			const target = map[id];
			if (!target) return null;
			// Defer to Vite's standard resolver, treating `target` as root-relative.
			return this.resolve(target, undefined, { skipSelf: true });
		},
	};
}

function pagefindDevAssetsPlugin(): PluginOption {
	return {
		name: 'gracile-docs:pagefind-dev-assets',
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				const url = req.url ? new URL(req.url, 'http://localhost') : null;
				const pathname = url?.pathname;

				if (!pathname?.startsWith('/pagefind/')) {
					next();
					return;
				}

				const relativePath = pathname.slice('/pagefind/'.length);
				const filePath = join(PAGEFIND_PUBLIC_DIR, relativePath);

				try {
					const contents = await readFile(filePath);
					const mimeType =
						PAGEFIND_MIME_TYPES[extname(filePath)] ??
						'application/octet-stream';
					res.statusCode = 200;
					res.setHeader('Content-Type', mimeType);
					res.end(contents);
				} catch {
					next();
				}
			});
		},
	};
}

function shellRoutes(): Parameters<typeof gracile>[0] {
	return {
		pages: { premises: { expose: true } },
		routes: {
			define: () => [
				{
					pattern: '/',
					filePath: join(ROUTES_DIR, '(home).tsx'),
					pageAssets: [
						toFsUrl(join(ROUTES_DIR, '(home).client.ts')),
						toFsUrl(join(ROUTES_DIR, '(home).scss')),
					],
				},
				{
					pattern: '/404',
					filePath: join(ROUTES_DIR, '404.tsx'),
					pageAssets: [toFsUrl(join(ROUTES_DIR, '404.scss'))],
				},
				{
					pattern: '/chat',
					filePath: join(ROUTES_DIR, 'chat.tsx'),
				},
				{
					pattern: '/docs/:path*/',
					filePath: join(ROUTES_DIR, 'docs', '[...path].tsx'),
					pageAssets: [
						toFsUrl(join(ROUTES_DIR, 'docs', '[...path].client.ts')),
						toFsUrl(join(ROUTES_DIR, 'docs', '[...path].scss')),
					],
				},
				{
					pattern: '/blog/:path*/',
					filePath: join(ROUTES_DIR, 'blog', '[...path].tsx'),
					pageAssets: [toFsUrl(join(ROUTES_DIR, 'blog', '[...path].scss'))],
				},
			],
		},
	};
}

/**
 * Gracile docs shell — a Vite preset that wires the entire documentation site
 * (routes, document, features, markdown processing, sitemap, OG images, icons,
 * minification, JSX, CSS Modules) for a consumer.
 *
 * The consumer provides only:
 * - Markdown content under `/src/content/{docs,blog}/**\/*.md`
 * - Brand constants in `/src/content/global.js`
 * - Home feature grid in `/src/content/feature-list.ts`
 * - Content aggregator in `/src/content/content.ts`
 * - `og-images.config.js` (brand template) at project root
 */
export async function gracileDocs(
	options: GracileDocsOptions,
): Promise<PluginOption[]> {
	const iconData = await loadCollection(
		join(PKG_ROOT, 'node_modules', '@iconify', 'json', 'json', 'ph.json'),
	);

	const userGracileConfig = options.gracile ?? {};
	const shell = shellRoutes();
	const mergedGracile = {
		...shell,
		...userGracileConfig,
		pages: { ...shell.pages, ...userGracileConfig.pages },
		routes: { ...shell.routes, ...userGracileConfig.routes },
	} satisfies Parameters<typeof gracile>[0];

	return [
		shellContentAliasPlugin(),
		pagefindDevAssetsPlugin(),
		iconifyLoader({
			iconSet: options.iconSet ?? DEFAULT_ICON_SET,
			data: iconData,
		}),
		gracile(mergedGracile),
		viteSvgPlugin(),
		vitePluginMarkdownLit(),
		viteSitemapPlugin({ siteUrl: options.siteUrl }),
		viteOgImagesGenerator({ additionalPatterns: ['!**/__*'] }),
		gracileJsx(),
		standardCssModules({ outputMode: 'CSSResult' }),
		literalsHtmlCssMinifier(),
	];
}

/**
 * Recommended Rollup options for consumers — wire via Vite's `build.rollupOptions`.
 */
export const gracileDocsRollupOptions = {
	plugins: [strip({})],
};

/**
 * Recommended Vite `resolve.dedupe` entries to avoid duplicate Lit copies.
 */
export const gracileDocsDedupe = [
	'lit',
	'lit-html',
	'@lit-labs/signals',
	'@lit-labs/ssr',
	'@lit-labs/ssr-client',
];
