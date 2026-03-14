// @ts-nocheck
// NOTE: Work-in-progress. Need a bit of clean-up + splitting into plugins
//
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkSmartypants from 'remark-smartypants';
import remarkAdmonitions from 'remark-github-beta-blockquote-admonitions';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

import rehypeRaw from 'rehype-raw';
import * as shiki from 'shiki';
import rehypeShiki from '@shikijs/rehype';
import { transformerTwoslash } from '@shikijs/twoslash';
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from '@shikijs/transformers';

import { toHast } from 'mdast-util-to-hast';

import { h } from 'hastscript';

import { unified } from 'unified';
import { sqlLang, sqlPjson } from './tm-grammars/sql.js';
import { litShikiLanguages } from './tm-grammars/lit.js';

const shikiCssVarsTheme = shiki.createCssVariablesTheme({
	name: 'css-variables',
	variablePrefix: '--shiki-',
	variableDefaults: {},
	fontStyle: true,
});

const rehypeExternalLinksOptions = {
	rel: ['noopener', 'noreferrer', 'nofollow'],
	target: '_blank',
	properties: { class: 'link-external' },
};

/**
 * Features:
 *
 * - Shiki
 * - SmartyPants
 * - GFM
 * - Admonitions
 * - External Links
 * - Auto-link headings
 *
 * @status Experimental
 * @example Usage
 *
 * ```ts
 * const result = await processor.process(input);
 * ```
 */
export const mdProcessor = unified()
	.use(remarkFrontmatter)
	.use(remarkParse)
	// NOTE: ORDER MATTERS! We don't want smart quotes in <pre><code></code></pre>
	.use(remarkSmartypants)

	.use(remarkAdmonitions, {
		classNameMaps: {
			block: (title) => `admonition admonition--${title.toLowerCase()}`,
			title: (title) =>
				`admonition-title admonition-title--${title.toLowerCase()}`,
		},

		titleTextMap: (title) => {
			// Removes `![]`
			let displayTitle = title.slice(2, -1);
			// Capitalize
			displayTitle = `${displayTitle.at(0)}${displayTitle
				.substring(1)
				.toLowerCase()}`;
			return {
				displayTitle,
				checkedTitle: displayTitle,
			};
		},
	})

	.use(remarkGfm)

	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeShiki, {
		theme: shikiCssVarsTheme,

		langs: [
			'html',
			'css',
			'javascript',
			'typescript',
			'tsx',
			'jsx',
			'md',
			'mdx',
			{
				name: 'twoslash',
				scopeName: 'text.twoslash',
			},
			'yaml',
			'sh',
			'astro',
			'nginx',
			'sql',
			'json',
			'jsonc',
			{
				...sqlPjson,
				...sqlLang,
			},

			...litShikiLanguages,
		],

		transformers: [
			{
				line(node, line) {
					if (
						node.children
							.at(0)
							?.children.at(0)
							.value.startsWith('// @filename:') ||
						node.children.at(0)?.children.at(0).value.startsWith('// FILE:')
					) {
						node.children.at(0).children.at(0).value = node.children
							.at(0)
							?.children.at(0)
							.value.replace('// @filename:', '📄')
							.replace('// FILE:', '📄');
						node.properties.class = [node.properties.class, 'filename'].join(
							' ',
						);
						node.children.at(0).properties.style = '';
					}
				},
			},

			{
				line(node, line) {
					const re = /\/\/ (WARNING|NOTE|IMPORTANT|TIP|CAUTION):/;
					const reHtml = /<!-- (WARNING|NOTE|IMPORTANT|TIP|CAUTION):/;
					const reJSX = /{\/\* (WARNING|NOTE|IMPORTANT|TIP|CAUTION):/;
					const text = node.children.at(0)?.children.at(0).value;

					if (re.test(text) || reHtml.test(text) || reJSX.test(text)) {
						node.children.at(0).children.at(0).value = text
							.replace(re, '')
							.replace(reHtml, '')
							.replace(reJSX, '')
							.replace(/-->$/, '');
						node.properties.class = [
							node.properties.class,
							'admonition',
							`admonition--${text
								.replace(re, (a, b) => b.toLowerCase())
								.replace(reHtml, (a, b) => b.toLowerCase())
								.replace(reJSX, (a, b) => b.toLowerCase())
								.trim()}`,
						].join(' ');
						node.children.at(0).properties.style = '';
					}
				},
			},
			transformerNotationHighlight(),
			transformerNotationWordHighlight(),
			transformerTwoslash({
				throws: false,
				onShikiError(error) {
					console.error({ error, code, lang });
				},
				langs: ['js', 'ts', 'tsx', 'jsx'],

				rendererRich: {
					hast: {
						hoverCompose({ popup, token }) {
							return [
								{
									type: 'element',
									tagName: 'sl-tooltip',
									properties: {
										placement: 'top-start',
										hoist: 'true',
									},
									children: [
										{
											type: 'element',
											tagName: 'span',
											properties: {},
											children: [token],
										},
										{
											type: 'element',
											tagName: 'span',
											properties: {
												slot: 'content',
												hidden: true,
											},
											children: [popup],
										},
									],
								},
							];
						},
					},

					renderMarkdown(md) {
						const mdd = unified()
							.use(remarkParse)
							.use(remarkGfm)
							.use(remarkRehype, { allowDangerousHtml: true })
							.use(remarkSmartypants)
							.use(rehypeExternalLinks, rehypeExternalLinksOptions)
							// NOTE: rehypeShiki does not work inside renderMarkdown
							.parse(md);

						return [toHast(mdd)];
					},
				},

				twoslashOptions: {
					extraFiles: {
						'./ambient.d.ts': `
/// <reference types="@gracile/svg/ambient.d.ts" />
/// <reference types="@gracile/markdown/ambient.d.ts" />
/// <reference types="vite/client" />
/// <reference types="@gracile-labs/jsx/dist/jsx-runtime.d.ts" />

declare module '@gracile/gracile/plugin' {
  export * from '@gracile/gracile/dist/plugin.d.ts';
}
declare module '@gracile/engine/plugin' {
  export * from '@gracile/engine/dist/plugin.d.ts';
}

declare module '@gracile/gracile/server-html' {
  export * from '@gracile/gracile/dist/server-html.d.ts';
}

declare module '@gracile/gracile/route' {
  export * from '@gracile/gracile/dist/route.d.ts';
}
declare module '@gracile/server/route' {
  export * from '@gracile/server/dist/route.d.ts';
}
declare module '@gracile/engine/routes/route' {
  export * from '@gracile/engine/dist/routes/route.d.ts';
}

declare module '@gracile/gracile/document' {
  export * from '@gracile/gracile/dist/route.d.ts';
}
declare module '@gracile/server/document' {
  export * from '@gracile/server/dist/document.d.ts';
}

declare module '@gracile/gracile/env' {
  export * from '@gracile/gracile/dist/env.d.ts';
}
declare module '@gracile/internal-utils/env' {
  export * from '@gracile/internal-utils/dist/env/prod-ssr.d.ts';
}

declare module '@gracile/gracile/node' {
  export * from '@gracile/gracile/dist/node.d.ts';
}
declare module '@gracile/engine/server/adapters/node' {
  export * from '@gracile/engine/dist/server/adapters/node.d.ts';
}
declare module '@gracile/gracile/hono' {
  export * from '@gracile/gracile/dist/hono.d.ts';
}
declare module '@gracile/engine/server/adapters/hono' {
  export * from '@gracile/engine/dist/server/adapters/hono.d.ts';
}
declare module '@gracile/engine/server/constants' {
  export * from '@gracile/engine/dist/server/constants.d.ts';
}

// ---

declare module '@gracile-labs/client-router/create' {
  export * from '@gracile-labs/client-router/dist/create.d.ts';
}
declare module '@gracile/metadata' {
  export * from '@gracile/metadata/dist/index.d.ts';
}
declare module '@gracile/svg/vite' {
  export * from '@gracile/svg/dist/vite.d.ts';
}
declare module '@gracile/sitemap/vite' {
  export * from '@gracile/sitemap/dist/vite.d.ts';
}

// ---

declare module "*.md" {
  export const content: import("lit").TemplateResult<1>;
  export const excerpt: import("lit").TemplateResult<1>;
  export const frontmatter: unknown;
  export const toc: any;
}

declare module '@gracile/markdown/module' {
  export * from '@gracile/markdown/dist/module.d.ts';
}

declare module '@gracile/markdown/vite' {
  export * from '@gracile/markdown/dist/vite.d.ts';
}

declare module '@gracile/markdown-preset-marked' {
  export * from '@gracile/markdown-preset-marked/dist/index.d.ts';
}

// ---

declare namespace Gracile {
  interface Locals {
    requestId: import('node:crypto').UUID;
    userEmail: string | null;
  }
}
declare namespace Express {
  interface Locals extends Gracile.Locals {}
}
`,
					},
				},
			}),
		],
	})

	.use(rehypeRaw)

	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings, {
		content(node) {
			node.properties.id = `doc_${node.properties.id}`;
			node.properties.dataToc = true;

			return [
				h('gr-icon.icon-link', {
					ariaHidden: 'true',
					name: 'link',
				}),
			];
		},
		behavior: 'append',

		properties: {},
	})

	.use(rehypeExternalLinks, rehypeExternalLinksOptions)
	.use(rehypeStringify, { allowDangerousHtml: true });
