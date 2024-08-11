export interface Settings {
	packageManager: string;
	location: string;
	template: string; // 'minimal' | 'blog' | 'empty';

	next: boolean | undefined;

	tooling: (
		| 'typescript'
		| 'prettier_editorconfig'
		| 'eslint'
		| 'stylelint'
		| 'vscode-settings'
	)[];
	// tooling: {
	// 	typescript: boolean;
	// 	prettier: boolean;
	// 	eslint: boolean;
	// 	stylelint: boolean;
	// 	editorconfig: boolean;
	// };
	addons: (
		| 'seo'
		| 'lazyHydration'
		| 'clientSideRouter'
		| 'prefetch'
		| 'devTools'
		| 'sitemap'
		| 'markdown'
		| 'ogImages'
	)[];
	// addons: {
	// 	seo: boolean;
	// 	lazyHydration: boolean;
	// 	clientSideRouter: boolean;
	// 	prefetch: boolean;
	// 	devTools: boolean;
	// 	sitemap: boolean;
	// 	markdown: boolean;
	// 	ogImages: boolean;
	// 	// pagefind: boolean;
	// };
	installDependencies: boolean | undefined;
	initializeGit: boolean | undefined;

	usePreviousSettings: boolean | undefined;
	clearPreviousSettings: boolean | undefined;
}

export type FilesMap = Map<string, string>;

export const TEMPLATE_LIST = [
	//
	'minimal-static',
	'minimal-server-express',
	'minimal-server-hono',

	'basics',
] as const;
export const TEMPLATE_LIST_ANON = [...(TEMPLATE_LIST as unknown as string[])];
