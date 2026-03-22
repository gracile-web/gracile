/* eslint-disable @typescript-eslint/require-await */
import type {
	CliConfigDeps,
	CliDeps,
	CliExecResult,
	CliPromptsDeps,
	PartialSettings,
} from '../types.js';

/**
 * Records all calls made to the mock functions for assertion.
 */
export interface MockCallRecorder {
	execCalls: { command: string; options?: { cwd?: string } | undefined }[];
	readFileCalls: { path: string | URL; encoding: string }[];
	writeFileCalls: { path: string; data: string }[];
	renameCalls: { oldPath: string; updatedPath: string }[];
	rmCalls: {
		path: string;
		options?: { force?: boolean; recursive?: boolean } | undefined;
	}[];
	existsSyncCalls: string[];
	fetchLatestVersionCalls: {
		packageName: string;
		options?: { version?: string } | undefined;
	}[];
	exitCalls: (number | undefined)[];
	promptResults: {
		texts: (string | symbol)[];
		selects: (string | symbol)[];
		confirms: (boolean | symbol)[];
	};
	configStore: PartialSettings;
	logMessages: { level: string; args: unknown[] }[];
}

export function createMockRecorder(): MockCallRecorder {
	return {
		execCalls: [],
		readFileCalls: [],
		writeFileCalls: [],
		renameCalls: [],
		rmCalls: [],
		existsSyncCalls: [],
		fetchLatestVersionCalls: [],
		exitCalls: [],
		promptResults: {
			texts: [],
			selects: [],
			confirms: [],
		},
		configStore: {},
		logMessages: [],
	};
}

export interface MockDepsOptions {
	/** Answers to return when prompts.text is called, consumed in order. */
	textAnswers?: (string | symbol)[];
	/** Answers to return when prompts.select is called, consumed in order. */
	selectAnswers?: (string | symbol)[];
	/** Answers to return when prompts.confirm is called, consumed in order. */
	confirmAnswers?: (boolean | symbol)[];
	/** What existsSync should return. Default: false. */
	existsSyncResult?: boolean | ((path: string) => boolean);
	/** What exec should return. Default: `{ stdout: '', stderr: '' }` */
	execResult?: CliExecResult | ((cmd: string) => CliExecResult);
	/** What readFile should return. Must be provided per-path. */
	readFileResults?: Map<string, string>;
	/** What fetchLatestVersion returns. Default: '1.0.0' */
	fetchLatestVersionResult?: string | ((package_: string) => string);
	/** Initial config store. */
	initialConfigStore?: PartialSettings;
}

/**
 * Creates a fully-mocked `CliDeps` that records all calls for assertions.
 * Pass `MockDepsOptions` to customize return values.
 */
export function createMockDeps(
	recorder: MockCallRecorder,
	options: MockDepsOptions = {},
): CliDeps {
	let textIndex = 0;
	let selectIndex = 0;
	let confirmIndex = 0;

	const configStore: PartialSettings = { ...options.initialConfigStore };
	recorder.configStore = configStore;

	const deps: CliDeps = {
		fs: {
			readFile: async (path, encoding) => {
				recorder.readFileCalls.push({
					path,
					encoding,
				});
				const key = typeof path === 'string' ? path : path.toString();
				return options.readFileResults?.get(key) ?? '{}';
			},
			writeFile: async (path, data) => {
				recorder.writeFileCalls.push({ path, data });
			},
			rename: async (oldPath, updatedPath) => {
				recorder.renameCalls.push({ oldPath, updatedPath });
			},
			rm: async (path, rmOptions) => {
				recorder.rmCalls.push({
					path,
					...(rmOptions ? { options: rmOptions } : {}),
				});
			},
			existsSync: (path) => {
				recorder.existsSyncCalls.push(path);
				if (typeof options.existsSyncResult === 'function')
					return options.existsSyncResult(path);
				return options.existsSyncResult ?? false;
			},
		},

		exec: async (command, execOptions?) => {
			recorder.execCalls.push({
				command,
				...(execOptions ? { options: execOptions } : {}),
			});
			if (typeof options.execResult === 'function')
				return options.execResult(command);
			return options.execResult ?? { stdout: '', stderr: '' };
		},

		prompts: {
			intro: () => {},
			outro: () => {},
			text: async () => {
				const answer = options.textAnswers?.[textIndex] ?? 'test-project';
				textIndex++;
				return answer;
			},
			select: (async () => {
				const answer = options.selectAnswers?.[selectIndex] ?? 'minimal-static';
				selectIndex++;
				return answer;
			}) as CliPromptsDeps['select'],
			confirm: async () => {
				const answer = options.confirmAnswers?.[confirmIndex] ?? true;
				confirmIndex++;
				return answer;
			},
			log: {
				info: (message) =>
					recorder.logMessages.push({ level: 'info', args: [message] }),
				warn: (message) =>
					recorder.logMessages.push({ level: 'warn', args: [message] }),
				error: (message) =>
					recorder.logMessages.push({ level: 'error', args: [message] }),
				success: (message) =>
					recorder.logMessages.push({ level: 'success', args: [message] }),
			},
			note: () => {},
			spinner: () => ({
				start: () => {},
				stop: () => {},
			}),
			cancel: () => {},
			isCancel: (value): value is symbol => typeof value === 'symbol',
		},

		config: {
			get: ((key: string) =>
				configStore[
					key as keyof PartialSettings
				]) as CliConfigDeps<PartialSettings>['get'],
			set: ((key: string, value: unknown) => {
				(configStore as Record<string, unknown>)[key] = value;
			}) as CliConfigDeps<PartialSettings>['set'],
			clear: () => {
				for (const key of Object.keys(configStore)) {
					delete (configStore as Record<string, unknown>)[key];
				}
			},
			store: configStore,
		},

		fetchLatestVersion: async (packageName, fetchOptions) => {
			recorder.fetchLatestVersionCalls.push({
				packageName,
				...(fetchOptions ? { options: fetchOptions } : {}),
			});
			if (typeof options.fetchLatestVersionResult === 'function')
				return options.fetchLatestVersionResult(packageName);
			return options.fetchLatestVersionResult ?? '1.0.0';
		},

		exit: ((code?: number) => {
			recorder.exitCalls.push(code);
			// In tests, we throw instead of actually exiting
			throw new ExitError(code);
		}) as CliDeps['exit'],

		logger: {
			info: (...arguments_) =>
				recorder.logMessages.push({ level: 'logger:info', args: arguments_ }),
			error: (...arguments_) =>
				recorder.logMessages.push({ level: 'logger:error', args: arguments_ }),
			warn: (...arguments_) =>
				recorder.logMessages.push({ level: 'logger:warn', args: arguments_ }),
		},

		env: {
			DEV: undefined,
			npm_config_user_agent: 'pnpm/9.0.0 node/v22.0.0',
		},
	};

	return deps;
}

/**
 * Thrown by `deps.exit()` in tests so we can assert exit was called
 * without actually terminating the process.
 */
export class ExitError extends Error {
	code: number | undefined;
	constructor(code?: number) {
		super(`process.exit(${code})`);
		this.name = 'ExitError';
		this.code = code;
	}
}
