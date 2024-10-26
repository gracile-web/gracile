import { html as litHtml } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import type { Heading, TocLevel } from './module.js';

export abstract class MarkdownRendererBase {
	#path: string | null = null;

	public get path() {
		return this.#path;
	}

	public setPath(path: this['path']) {
		this.#path = path;
	}

	#source: string | null = null;

	public get source() {
		return this.#source;
	}

	public setSource(source: this['source']) {
		this.#source = source;
	}

	#sourceMarkdown: string | null = null;

	public get sourceMarkdown() {
		return this.#sourceMarkdown;
	}

	public setSourceMarkdown(sourceMarkdown: this['sourceMarkdown']) {
		this.#sourceMarkdown = sourceMarkdown;
	}

	#sourceYaml: string | null = null;

	public get sourceYaml() {
		return this.#sourceYaml;
	}

	public setSourceYaml(sourceYaml: this['sourceYaml']) {
		this.#sourceYaml = sourceYaml;
	}

	#frontmatter: unknown = null;

	public get frontmatter() {
		return this.#frontmatter;
	}

	public setFrontmatter(frontmatter: this['frontmatter']) {
		this.#frontmatter = frontmatter;
	}

	#tableOfContents: TocLevel[] = [];

	public get tableOfContents() {
		return this.#tableOfContents;
	}

	public setTableOfContents(tableOfContents: this['tableOfContents']) {
		this.#tableOfContents = tableOfContents;
	}

	#tableOfContentsFlat: Heading[] = [];

	public get tableOfContentsFlat() {
		return this.#tableOfContentsFlat;
	}

	public setTableOfContentsFlat(
		tableOfContentsFlat: this['tableOfContentsFlat'],
	) {
		this.#tableOfContentsFlat = tableOfContentsFlat;
	}

	// #excerptLit: TemplateResult<1> | null = null;

	// public get excerptLit() {
	// 	return this.#excerptLit;
	// }

	// public setExcerptLit(excerptLit: this['excerptLit']) {
	// 	this.#excerptLit = excerptLit;
	// }

	public get excerptLit() {
		return this.#excerptHtml ? litHtml`${unsafeHTML(this.#excerptHtml)}` : null;
	}

	// ---

	#excerptHtml: string | null = null;

	public get excerptHtml() {
		return this.#excerptHtml;
	}

	public setExcerptHtml(excerptHtml: this['excerptHtml']) {
		this.#excerptHtml = excerptHtml;
	}

	#excerptText: string | null = null;

	public get excerptText() {
		return this.#excerptText;
	}

	public setExcerptText(excerptText: this['excerptText']) {
		this.#excerptText = excerptText;
	}

	// ---

	#slug: string | null = null;

	public get slug() {
		return this.#slug;
	}

	public setSlug(slug: this['slug']) {
		this.#slug = slug;
	}

	#title: string | null = null;

	public get title() {
		return this.#title;
	}

	public setTitle(title: this['title']) {
		this.#title = title;
	}

	#html: string | null = null;

	public get html() {
		return this.#html;
	}

	public setHtml(html: this['html']) {
		this.#html = html;
	}

	// #lit: string | null = null;

	// public get lit() {
	// 	return this.#lit;
	// }

	// public setLit(lit: this['lit']) {
	// 	this.#lit = lit;
	// }

	// NOTE: Not working with serialization (with Vite module generation).
	public get lit() {
		return litHtml`${unsafeHTML(this.#html)}`;
	}

	public get() {
		return litHtml`${unsafeHTML(this.#html)}`;
	}

	// eslint-disable-next-line @typescript-eslint/require-await, class-methods-use-this
	public async parseDocument(): Promise<void> {
		throw new Error('Not implemented.');
	}

	public async init(options: { path?: string; source: string }): Promise<void> {
		// NOTE: Nothing changed
		if (options.path === this.path && options.source === this.source) return;

		if (options.path) this.setPath(options.path);
		this.setSource(options.source);
		await this.parseDocument();
	}
}

// NOTE: Stub (cannot `typeof` an abstract)
export class MarkdownDocumentRendererEmpty extends MarkdownRendererBase {}
