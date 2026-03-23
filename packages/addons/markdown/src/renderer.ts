import { html as litHtml, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import type { Heading, TocLevel } from './module.js';

export abstract class MarkdownRendererBase {
	#path: string | null = null;

	public get path(): string | null {
		return this.#path;
	}

	public setPath(path: this['path']): void {
		this.#path = path;
	}

	#source: string | null = null;

	public get source(): string | null {
		return this.#source;
	}

	public setSource(source: this['source']): void {
		this.#source = source;
	}

	#sourceMarkdown: string | null = null;

	public get sourceMarkdown(): string | null {
		return this.#sourceMarkdown;
	}

	public setSourceMarkdown(sourceMarkdown: this['sourceMarkdown']): void {
		this.#sourceMarkdown = sourceMarkdown;
	}

	#sourceYaml: string | null = null;

	public get sourceYaml(): string | null {
		return this.#sourceYaml;
	}

	public setSourceYaml(sourceYaml: this['sourceYaml']): void {
		this.#sourceYaml = sourceYaml;
	}

	#frontmatter: unknown = null;

	public get frontmatter(): unknown {
		return this.#frontmatter;
	}

	public setFrontmatter(frontmatter: this['frontmatter']): void {
		this.#frontmatter = frontmatter;
	}

	#tableOfContents: TocLevel[] = [];

	public get tableOfContents(): TocLevel[] {
		return this.#tableOfContents;
	}

	public setTableOfContents(tableOfContents: this['tableOfContents']): void {
		this.#tableOfContents = tableOfContents;
	}

	#tableOfContentsFlat: Heading[] = [];

	public get tableOfContentsFlat(): Heading[] {
		return this.#tableOfContentsFlat;
	}

	public setTableOfContentsFlat(
		tableOfContentsFlat: this['tableOfContentsFlat'],
	): void {
		this.#tableOfContentsFlat = tableOfContentsFlat;
	}

	// #excerptLit: TemplateResult<1> | null = null;

	// public get excerptLit() {
	// 	return this.#excerptLit;
	// }

	// public setExcerptLit(excerptLit: this['excerptLit']) {
	// 	this.#excerptLit = excerptLit;
	// }

	public get excerptLit(): TemplateResult<1> | null {
		return this.#excerptHtml ? litHtml`${unsafeHTML(this.#excerptHtml)}` : null;
	}

	// ---

	#excerptHtml: string | null = null;

	public get excerptHtml(): string | null {
		return this.#excerptHtml;
	}

	public setExcerptHtml(excerptHtml: this['excerptHtml']): void {
		this.#excerptHtml = excerptHtml;
	}

	#excerptText: string | null = null;

	public get excerptText(): string | null {
		return this.#excerptText;
	}

	public setExcerptText(excerptText: this['excerptText']): void {
		this.#excerptText = excerptText;
	}

	// ---

	#slug: string | null = null;

	public get slug(): string | null {
		return this.#slug;
	}

	public setSlug(slug: this['slug']): void {
		this.#slug = slug;
	}

	#title: string | null = null;

	public get title(): string | null {
		return this.#title;
	}

	public setTitle(title: this['title']): void {
		this.#title = title;
	}

	#html: string | null = null;

	public get html(): string | null {
		return this.#html;
	}

	public setHtml(html: this['html']): void {
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
	public get lit(): TemplateResult<1> {
		return litHtml`${unsafeHTML(this.#html)}`;
	}

	public get(): TemplateResult<1> {
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
