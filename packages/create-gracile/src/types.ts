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

	dryRun: boolean | undefined;
}

export type PartialSettings = Partial<Settings>;

export type FilesMap = Map<string, string>;

// MARK: Dependency injection interfaces

export interface CliFsDeps {
	readFile: (path: string | URL, encoding: BufferEncoding) => Promise<string>;
	writeFile: (path: string, data: string) => Promise<void>;
	rename: (oldPath: string, updatedPath: string) => Promise<void>;
	rm: (
		path: string,
		options?: { force?: boolean; recursive?: boolean },
	) => Promise<void>;
	existsSync: (path: string) => boolean;
}

export interface CliExecResult {
	stdout: string;
	stderr: string;
}

export type CliExecFunction = (
	command: string,
	options?: { cwd?: string },
) => Promise<CliExecResult>;

export interface CliPromptsDeps {
	intro: (title?: string) => void;
	outro: (message?: string) => void;
	text: (options: {
		message: string;
		placeholder?: string;
		validate?: (value: string) => string | void;
	}) => Promise<string | symbol>;
	select: <T>(options: {
		message: string;
		options: { value: T; label: string; hint?: string }[];
	}) => Promise<T | symbol>;
	confirm: (options: { message: string }) => Promise<boolean | symbol>;
	log: {
		info: (message: string) => void;
		warn: (message: string) => void;
		error: (message: string) => void;
		success: (message: string) => void;
	};
	note: (message: string, title?: string) => void;
	spinner: () => {
		start: (message?: string) => void;
		stop: (message?: string) => void;
	};
	cancel: (message?: string) => void;
	isCancel: (value: unknown) => value is symbol;
}

export interface CliConfigDeps<T extends Record<string, unknown>> {
	get: <K extends keyof T>(key: K) => T[K];
	set: <K extends keyof T>(key: K, value: T[K]) => void;
	clear: () => void;
	store: T;
}

export type CliFetchLatestVersion = (
	packageName: string,
	options?: { version?: string },
) => Promise<string>;

export interface CliLoggerDeps {
	info: (...arguments_: unknown[]) => void;
	error: (...arguments_: unknown[]) => void;
	warn: (...arguments_: unknown[]) => void;
}

export interface CliEnvironment {
	DEV?: string | undefined;
	npm_config_user_agent?: string | undefined;
}

export interface CliDeps {
	fs: CliFsDeps;
	exec: CliExecFunction;
	prompts: CliPromptsDeps;
	config: CliConfigDeps<PartialSettings>;
	fetchLatestVersion: CliFetchLatestVersion;
	exit: (code?: number) => never;
	logger: CliLoggerDeps;
	env: CliEnvironment;
}

export interface CliContext {
	cliVersion: string;
	packageManager: string;
	settings: PartialSettings;
	projectDestination: string;
}

export const TEMPLATE_LIST = [
	//
	'minimal-static',
	'minimal-server-express',
	'minimal-server-hono',

	'minimal-client-routing',
	'minimal-minification',
	'minimal-testing',
	'minimal-bootstrap-tailwind',

	'basics',
] as const;
export const TEMPLATE_LIST_ANON = [...(TEMPLATE_LIST as unknown as string[])];
