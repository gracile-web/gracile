export interface TocLevel {
	value: string;
	id: string;
	depth: number;
	children: TocLevel[];
}

export interface MarkdownModule {
	content: string;
	html: string;
	excerpt: string;
	excerptHtml: import('lit').TemplateResult<1>;
	frontmatter: unknown;
	toc: TocLevel[];

	title: string;
	titleHtml: string;

	path: string;
	absolutePath: string;
}
