import { readFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';

import type { PluginOption } from 'vite';
import { gracile } from '@gracile/gracile/plugin';
import { viteSvgPlugin } from '@gracile/svg/vite';
import { viteSitemapPlugin } from '@gracile/sitemap/vite';
import { viteOgImagesGenerator } from 'og-images-generator/vite';
import strip from '@rollup/plugin-strip';
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import { getIcons } from '@iconify/utils';
import { loadCollection } from '@iconify/json';
import { standardCssModules } from 'vite-plugin-standard-css-modules';

import { vitePluginMarkdownLit } from './lib/markdown/vite-plugin-markdown-lit.js';
import {
	createDocsOgImagesConfig,
	type DocsOgImagesColorPalette,
} from './og-images/shared.js';

const HERE = import.meta.dirname;
const PKG_ROOT = dirname(HERE); // -> packages/labs/docs
const ROUTES_DIR = join(HERE, 'routes');
const PAGEFIND_PUBLIC_DIR = join(PKG_ROOT, 'public', 'pagefind');
const USER_THEME_ASSET = 'src/content/theme.css';

const PAGEFIND_MIME_TYPES: Record<string, string> = {
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.pf_meta': 'application/octet-stream',
	'.pagefind': 'application/wasm',
};

function toFsUrl(absPath: string): string {
	return `@fs${absPath}`;
}

export interface GracileDocsOptions {
	siteUrl: string;
	iconSet?: string[];
	gracile?: Parameters<typeof gracile>[0];
	ogImagesGenerator?: {
		enabled?: boolean;
		logoSvg?: string;
		siteTitle?: string;
		siteSubtitle?: string;
		colorPalette?: DocsOgImagesColorPalette;
	};
}

export interface DocsConfig {
	site: DocsSiteConfig;
	home: DocsHomeConfig;
}

export interface DocsSiteConfig {
	title: string;
	subtitle: string;
	url: string;
	logoHref: string;
	themeColor?: string;
	description: string;
	issuesUrl: string;
	repoUrl: string;
	docsRepoUrl: string;
	discordInvitePath: string;
	discordInviteUrl: string;
	playgroundUrl: string;
	sponsorUrl?: string;
	mainSiteUrl?: string;
	nextSiteUrl?: string;
	license: string;
	version: string;
	authors: string;
}

export interface DocsHomeConfig {
	logoHtml: string;
	logoSplashScreenHtml: string;
	descriptionHtml: string;
	installCommand: string;
	starterProjectsPath?: string;
	faqPath?: string;
	splashLinks: DocsSplashLink[];
	worksWith: DocsWorksWithItem[];
}

export interface DocsSplashLink {
	label: string;
	href: string;
	icon: string;
}

export interface DocsWorksWithItem {
	label: string;
	detail?: string;
	iconUrl: string;
	iconDarkUrl?: string;
	iconLightUrl?: string;
	alt?: string;
	style?: string;
}

export interface DocsFeature {
	title: string;
	desc?: string;
	description?: string;
	href?: string;
	icon?: string;
	tags?: string[];
	[key: string]: unknown;
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

function shellContentAliasPlugin(): PluginOption {
	const map: Record<string, string> = {
		'@gracile-docs/content': '/src/content/content.ts',
	};
	return {
		name: 'gracile-docs:content-alias',
		enforce: 'pre',
		config(userConfig) {
			const consumerRoot = userConfig.root ?? process.cwd();
			const consumerParent = dirname(consumerRoot);
			const consumerGrandParent = dirname(consumerParent);
			return {
				server: {
					fs: {
						allow: [
							consumerRoot,
							consumerParent,
							consumerGrandParent,
							PKG_ROOT,
						],
					},
				},
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
			return this.resolve(target, undefined, { skipSelf: true });
		},
	};
}

function pagefindDevAssetsPlugin(): PluginOption {
	let consumerRoot = process.cwd();

	return {
		name: 'gracile-docs:pagefind-dev-assets',
		configResolved(config) {
			consumerRoot = config.root;
		},
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				const url = req.url ? new URL(req.url, 'http://localhost') : null;
				const pathname = url?.pathname;

				if (!pathname?.startsWith('/pagefind/')) {
					next();
					return;
				}

				const relativePath = pathname.slice('/pagefind/'.length);
				const filePaths = [
					join(consumerRoot, 'public', 'pagefind', relativePath),
					join(consumerRoot, 'dist', 'pagefind', relativePath),
					join(PAGEFIND_PUBLIC_DIR, relativePath),
				];

				for (const filePath of filePaths) {
					try {
						const contents = await readFile(filePath);
						const mimeType =
							PAGEFIND_MIME_TYPES[extname(filePath)] ??
							'application/octet-stream';
						res.statusCode = 200;
						res.setHeader('Content-Type', mimeType);
						res.end(contents);
						return;
					} catch {
						// Try the next source. Consumers win over the bundled Gracile fallback.
					}
				}

				next();
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
					filePath: join(ROUTES_DIR, '(home).js'),
					pageAssets: [
						USER_THEME_ASSET,
						toFsUrl(join(ROUTES_DIR, '(home).client.js')),
						toFsUrl(join(ROUTES_DIR, '(home).css')),
					],
				},
				{
					pattern: '/404',
					filePath: join(ROUTES_DIR, '404.js'),
					pageAssets: [USER_THEME_ASSET, toFsUrl(join(ROUTES_DIR, '404.css'))],
				},
				{
					pattern: '/chat',
					filePath: join(ROUTES_DIR, 'chat.js'),
					pageAssets: [USER_THEME_ASSET],
				},
				{
					pattern: '/docs/:path*/',
					filePath: join(ROUTES_DIR, 'docs', '[...path].js'),
					pageAssets: [
						USER_THEME_ASSET,
						toFsUrl(join(ROUTES_DIR, 'docs', '[...path].client.js')),
						toFsUrl(join(ROUTES_DIR, 'docs', '[...path].css')),
					],
				},
				{
					pattern: '/blog/:path*/',
					filePath: join(ROUTES_DIR, 'blog', '[...path].js'),
					pageAssets: [
						USER_THEME_ASSET,
						toFsUrl(join(ROUTES_DIR, 'blog', '[...path].css')),
					],
				},
			],
		},
	};
}

export async function gracileDocs(
	options: GracileDocsOptions,
): Promise<PluginOption[]> {
	const iconData = await loadCollection(
		join(PKG_ROOT, 'node_modules', '@iconify', 'json', 'json', 'ph.json'),
	);

	const userGracileConfig = options.gracile ?? {};
	const shell = shellRoutes()!;
	const ogImagesConfig = createDocsOgImagesConfig({
		logoSvg: options.ogImagesGenerator?.logoSvg,
		siteTitle: options.ogImagesGenerator?.siteTitle,
		siteSubtitle: options.ogImagesGenerator?.siteSubtitle,
		colorPalette: options.ogImagesGenerator?.colorPalette,
	});
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
		options.ogImagesGenerator?.enabled === false
			? null
			: viteOgImagesGenerator({
					additionalPatterns: ['!**/__*'],
					config: ogImagesConfig,
				}),
		standardCssModules({ outputMode: 'CSSResult' }),
		literalsHtmlCssMinifier(),

		// TODO: Test if it works with vite (not rollup)
		strip({}),
	];
}

export const gracileDocsRollupOptions = {
	plugins: [],
};

export const gracileDocsDedupe = [
	'lit',
	'lit-html',
	'@lit-labs/signals',
	'@lit-labs/ssr',
	'@lit-labs/ssr-client',
];
