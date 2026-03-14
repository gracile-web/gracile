// @ts-nocheck

// NOTE: Work-in-progress. Need a bit of clean-up + splitting into plugins
//
import rehypeExtractExcerpt from 'rehype-extract-excerpt';
import rehypeStringify from 'rehype-stringify';
import remarkExcerpt from 'remark-excerpt';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkAdmonitions from 'remark-github-beta-blockquote-admonitions';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import { stripHtml as stringStripHtml } from 'string-strip-html';
import remarkStripMd from 'strip-markdown';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import remarkSmartypants from 'remark-smartypants';
import rehypeSlug from 'rehype-slug';
import yaml from 'yaml';

import withExtractedTableOfContents from './rehype-extract-toc.ts';
import { mdProcessor } from './md-processor.ts';

/**
 * @param {string} input
 */
export async function processMd(input) {
	const result = await mdProcessor.process(input);

	return {
		markdown: result.value.toString(),
		data: result.data,
	};
}

/**
 * Strips all Markdown, while keeping spacing.
 * @param {string} input
 * @returns {Promise<string>}
 */
export async function stripMd(input) {
	const result = await unified()
		.use(remarkParse)
		.use(remarkStripMd)
		.use(remarkStringify)
		.process(input);

	return result.value.toString();
}

/**
 * @param {string} input
 * @returns {Promise<string>}
 */
export async function stripHtml(input) {
	const result = stringStripHtml(input, { skipHtmlDecoding: true }).result;

	return result;
}

export function remarkRemoveHeadings() {
	return (tree) => {
		visit(tree, 'heading', (node, index, parent) => {
			parent.children.splice(index, 1);
			return [SKIP, index];
		});
	};
}

/**
 * @param {string} input
 * @returns {Promise<string>}
 */
export async function extractExcerptMd(input) {
	const result = await unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkRemoveHeadings)
		.use(remarkExcerpt, { maxLength: 160, ellipsis: '…' })

		.use(remarkStringify)
		.process(input);

	return result.value.toString();
}

/**
 * @param {string} input
 */
export async function extractExcerptHtml(input) {
	const result = await unified()
		.use(remarkFrontmatter)
		.use(() => {
			return function (tree, vfile) {
				if ('children' in tree) {
					const yamlRaw = tree.children.find((node) => node.type === 'yaml');
					if (yamlRaw) {
						vfile.data['frontmatter'] = yaml.parse(yamlRaw.value);
					}
				}
			};
		})
		.use(remarkParse)
		.use(remarkSmartypants)

		.use(remarkRehype, { allowDangerousHtml: true })

		.use(rehypeSlug)

		.use(withExtractedTableOfContents)
		.use(rehypeExtractExcerpt, { maxLength: 160, ellipsis: '…' })

		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(input);

	return result;
}
