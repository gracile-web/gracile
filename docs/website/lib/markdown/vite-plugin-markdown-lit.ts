// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck TODO: type this plugin
import path from 'node:path';

import {
	extractExcerptHtml as extractMetadata,
	processMd,
	stripHtml,
} from './transforms.ts';

/**
 * @returns {import('vite').Plugin}
 */
export function vitePluginMarkdownLit() {
	return {
		name: 'vite-plugin-markdown-lit',
		enforce: 'pre',

		async transform(code, id) {
			const metaOnly = id.endsWith('.md?meta');
			const allData = id.endsWith('.md');

			if (!metaOnly && !allData) return null;

			// TODO: custom processors

			const vfile = await extractMetadata(code);
			const text = await stripHtml(vfile.data.excerpt ?? '');
			const excerpt = text.trim();

			const { markdown } = {
				markdown: allData
					? // eslint-disable-next-line unicorn/no-await-expression-member
						(await processMd(code)).markdown
					: '<!-- Content not rendered -->',
			};

			const { frontmatter, toc } = vfile.data;

			return {
				code: `
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export const excerptHtml = html\`\${unsafeHTML(${JSON.stringify(excerpt)})}\`;
export const excerpt = \`${excerpt}\`;

export const toc = ${JSON.stringify(toc)};
export const title = "${toc?.at(0)?.value ?? ''}";
export const titleHtml = "${toc?.at(0)?.html ?? ''}";

export const frontmatter = ${JSON.stringify(frontmatter)};

export const path = '/${path.relative(process.cwd(), id.replace(/\?meta$/, ''))}';
export const absolutePath = '${path.join(process.cwd(), id)}';

export const content = ${JSON.stringify(markdown)};

`,
			};
		},
	};
}
