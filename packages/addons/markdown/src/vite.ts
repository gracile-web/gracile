import fs from 'node:fs';
import { relative } from 'node:path';

import { logger } from '@gracile/internal-utils/logger';
import type { Plugin } from 'vite';

import { MarkdownDocumentRendererEmpty } from './renderer.js';

const VITE_PLUGIN_NAME = 'vite-plugin-gracile-markdown';
const fileRegex = /\.md$/;

export function viteMarkdownPlugin(options?: {
	MarkdownRenderer: typeof MarkdownDocumentRendererEmpty;
}): Plugin {
	const MarkdownDocumentRenderer =
		options?.MarkdownRenderer ?? MarkdownDocumentRendererEmpty;

	let root: string | null = null;
	return {
		name: VITE_PLUGIN_NAME,
		enforce: 'pre',

		config(config) {
			root = config.root || null;
		},

		async load(id: string) {
			if (!root) throw new Error('Missing server');

			if (fileRegex.test(id)) {
				let markdownCode: string | undefined;
				try {
					markdownCode = await fs.promises.readFile(id, 'utf8');
				} catch (exception) {
					logger.warn(`${id} couldn't be read\n${String(exception)}`);
					return null;
				}

				const markdownDocument = new MarkdownDocumentRenderer();
				await markdownDocument.init({ path: id, source: markdownCode });

				try {
					// NOTE: Lit template cannot be stringified
					// lit: Object.freeze(${JSON.stringify(markdownDocument.lit)}),
					return `import { html } from 'lit';

export default Object.freeze({
	path: Object.freeze({
		absolute: ${JSON.stringify(id)},
		relative: ${JSON.stringify(relative(root ?? process.cwd(), id))},
	}),

	body: Object.freeze({
		html: ${JSON.stringify(markdownDocument.html)},
		lit: Object.freeze(html\`${(markdownDocument.html || '').replaceAll('`', '\\`')}\`),
	}),

	meta: Object.freeze({
		slug: ${JSON.stringify(markdownDocument.slug)},
		title: ${JSON.stringify(markdownDocument.title)},
		frontmatter: Object.freeze(${JSON.stringify(markdownDocument.frontmatter)}),
		tableOfContents: Object.freeze(${JSON.stringify(markdownDocument.tableOfContents)}),
		tableOfContentsFlat: Object.freeze(${JSON.stringify(markdownDocument.tableOfContentsFlat)}),
	}),

	excerpt: Object.freeze({
		html: ${JSON.stringify(markdownDocument.excerptHtml)},
		lit: Object.freeze(html\`${(markdownDocument.excerptHtml || '').replaceAll('`', '\\`')}\`),
		text: ${JSON.stringify(markdownDocument.excerptText)},
	}),

	source: Object.freeze({
		file: ${JSON.stringify(markdownDocument.source)},
		markdown: ${JSON.stringify(markdownDocument.sourceMarkdown)},
		yaml: ${JSON.stringify(markdownDocument.sourceYaml)},
	}),
});
`;
				} catch (exception) {
					logger.error(
						`${id} errored during Markdown loadiing:\n${String(exception)}`,
					);
					return null;
				}
			}
			return null;
		},
	};
}
