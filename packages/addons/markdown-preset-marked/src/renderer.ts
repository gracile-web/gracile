/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Heading, TocLevel } from '@gracile/markdown/module';
import { MarkdownRendererBase } from '@gracile/markdown/renderer';
import { slug as slugger } from 'github-slugger';
import { marked, type Token } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import * as ultramatter from 'ultramatter';

let collectedHeadings: Heading[] = [];
let collectedExcerpt = '';

export class MarkdownRenderer extends MarkdownRendererBase {
	async parseDocument() {
		if (this.source === null) throw new Error('No source set for document.');

		const { frontmatter, content } = ultramatter.parse(this.source);

		this.setFrontmatter(frontmatter);
		const FENCE = '---'.length;
		this.setSourceYaml(
			this.source.replace(content, '').trim().slice(FENCE, -FENCE).trim(),
		);
		this.setSourceMarkdown(content);

		collectedHeadings = [];
		collectedExcerpt = '';
		const html = await marked.parse(content);

		this.setTableOfContents(buildHierarchy(collectedHeadings));
		this.setTableOfContentsFlat(collectedHeadings);

		const title = collectedHeadings.at(0)?.text;
		if (title) this.setTitle(title);

		this.setHtml(html);

		this.setExcerptText(collectedExcerpt);

		if (this.path)
			this.setSlug(this.path.split('/').at(-1)?.replace(/\.md$/, '') ?? '');
	}
}

function buildHierarchy(flatToc: Heading[]) {
	const toc: TocLevel[] = [];
	const parentHeadings = new Map<number, TocLevel>();

	// eslint-disable-next-line unicorn/no-array-for-each
	flatToc.forEach((h: Heading) => {
		const heading: TocLevel = { ...h, children: [] };
		parentHeadings.set(heading.depth, heading);

		if (heading.depth === 1) {
			toc.push(heading);
		} else {
			parentHeadings.get(heading.depth - 1)?.children.push(heading);
		}
	});

	return toc;
}

const collectHeadingsWalker = (token: Token) => {
	if (token.type !== 'heading') return;
	if (typeof token.text !== 'string') return;
	if (typeof token.depth !== 'number') return;
	const slug = slugger(token.text);

	collectedHeadings.push({
		text: token.text,
		depth: token.depth,
		slug,
	});
};

const collectExcerpt = (token: Token) => {
	if (collectedExcerpt) return;
	if (token.type !== 'paragraph') return;
	if (typeof token.text !== 'string') return;

	collectedExcerpt = token.text;
};

marked.use(gfmHeadingId());

marked.use({ walkTokens: collectHeadingsWalker });
marked.use({ walkTokens: collectExcerpt });
