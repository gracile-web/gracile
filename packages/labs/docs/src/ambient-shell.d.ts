/** Ambient module declaration for the consumer content entrypoint. */

declare module '@gracile-docs/content' {
	// import type { MarkdownModule } from '@gracile/markdown/md-module';

	import type { MarkdownModule } from './lib/markdown/md-module.js';

	import type { DocsConfig, DocsFeature } from '@gracile-labs/docs/vite';

	export type MarkdownModuleConsumable = {
		pathParams: string | undefined;
		href: string;
		module: MarkdownModule;
	};

	export const docsConfig: DocsConfig;
	export const featureList: ReadonlyArray<DocsFeature>;
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
		markdownModulesToTreeNode(modules: Record<string, MarkdownModule>): unknown;
	};
}

// declare module 'jsx-forge/jsx-runtime' {
// 	namespace JSX {
// 		interface IntrinsicElements {
// 			/**
// 			 * Gracile router template outlet (used in server rendered document).
// 			 */
// 			'route-template-outlet': Record<string, never>;
// 		}
// 	}
// }
