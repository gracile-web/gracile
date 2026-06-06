/// <reference types="@gracile/gracile/ambient" />

import type { MarkdownModule } from './lib/markdown/md-module.js';

//// <reference types="@gracile/markdown/ambient" />

declare module 'iconify:loader' {
	export const iconSet: {
		prefix: string;
		icons: Record<string, { body: string }>;
	};
}

declare module '*.md' {
	const markdownModule: MarkdownModule;

	export default markdownModule;
}

export {};
