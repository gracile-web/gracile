/**
 * Ambient module declarations for the shell-to-consumer content contract.
 *
 * The {@link gracileDocs} Vite plugin aliases these specifiers onto files
 * the consumer provides under `/src/content/`.
 */

declare module '@gracile-docs/site' {
	export const SITE_TITLE: string;
	export const SITE_SUBTITLE: string;
	export const SITE_URL: string;
	export const SITE_DESCRIPTION: string;
	export const ISSUES_URL: string;
	export const REPO_URL: string;
	export const DOCS_REPO_URL: string;
	export const DISCORD_INVITE_PATH: string;
	export const DISCORD_INVITE_ALIAS: string;
	export const DISCORD_INVITE_URL: string;
	export const PLAYGROUND_URL: string;
	export const PKG_LICENSE: string;
	export const PKG_VERSION: string;
	export const PROJECT_AUTHORS: string;
}

declare module '@gracile-docs/feature-list' {
	export const featureList: ReadonlyArray<{
		title: string;
		description?: string;
		icon?: string;
		[key: string]: unknown;
	}>;
}

declare module '@gracile-docs/content' {
	import type { MarkdownModule } from '@gracile/markdown/md-module';

	export type MarkdownModuleConsumable = {
		pathParams: string | undefined;
		href: string;
		module: MarkdownModule;
	};

	export const docsMetaImportsGlob: Record<string, MarkdownModule>;
	export const docsContentImportsGlob: Record<
		string,
		() => Promise<MarkdownModule>
	>;
	export const docsMetaImports: MarkdownModuleConsumable[];
	export const blogContentImportsGlob: Record<
		string,
		() => Promise<MarkdownModule>
	>;
	export const blogMetaImports: MarkdownModuleConsumable[];
	export const markdownTree: unknown;
	export const pathsHandlers: {
		filePathToDocsPathParam(path: string): string | undefined;
		pathToHref(path: string): string;
		markdownModulesToTreeNode(
			modules: Record<string, MarkdownModule>,
		): unknown;
	};
}
