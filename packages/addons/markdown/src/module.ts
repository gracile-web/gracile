import type { TemplateResult } from 'lit';

// NOTE: Using types instead of interface because it breaks in the ambient file for TwoSlash
// Very weird bug…

export type TocLevel = {
	text: string;
	depth: number;
	slug: string;
	children: TocLevel[];
};

export type Heading = Omit<TocLevel, 'children'>;

export type MarkdownModule = {
	path: {
		absolute: string;
		relative: string;
	};

	body: {
		html: string;
		lit: TemplateResult;
	};

	excerpt: {
		html: string;
		lit: TemplateResult;
		text: string;
	};

	meta: {
		slug: string;
		title: string;
		frontmatter: Record<string, unknown>;
		tableOfContents: TocLevel[];
		tableOfContentsFlat: Heading[];
	};

	source: {
		file: string;
		markdown: string;
		yaml: string;
	};
};
