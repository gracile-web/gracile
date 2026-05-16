// TODO: When other transformers land, extract and share TS sidecar builder.
// FIXME: Attribute awareness can something be stall.
// Probably non JSX imported files that are not updated.
import * as ts from 'typescript';
import {
	createJsxToLiteralsTransformer,
	type TransformerOptions,
} from 'jsx-forge/to-literals';
import { PRESETS } from 'jsx-forge/presets/lit';
import type { TsWithInternals } from 'jsx-forge/types';
import type { Plugin } from 'vite';

const VITE_PLUGIN_NAME = 'vite-plugin-jsx-forge--to-literals';

export interface VitePluginOptions extends TransformerOptions {
	/**
	 * Path to the tsconfig to use for the TS Program.
	 * Defaults to `'tsconfig.json'` resolved from `root`.
	 */
	tsconfig?: string;

	/**
	 * When `true` (default), uses a TypeScript LanguageService for type-aware
	 * transforms — automatic `?attr` boolean bindings, `ifDefined()` wrapping
	 * for `T | undefined`, and type-based spread expansion.
	 *
	 * When `false`, runs a purely **syntactic** transform (no type checker).
	 * Much faster (~5× on incremental), but type-based bindings are disabled.
	 * Use explicit namespace prefixes (`bool:`, `if:`, `on:`, `.prop:`) instead.
	 */
	typeAware?: boolean;
}

/**
 * Vite plugin that transforms `.tsx` JSX into Lit tagged template literals.
 *
 * Uses a TypeScript **LanguageService** for efficient incremental updates.
 * On each transform, only the changed file's version is bumped — the service
 * reuses module resolution, symbol tables, and type information for unchanged
 * files. Emits via `program.emit` with the jsx-forge transformer.
 * No `@rollup/plugin-typescript` or `ts-patch` needed.
 */
export function gracileJsxToLiterals(options?: VitePluginOptions): Plugin[] {
	const typeAware = options?.typeAware !== false;

	return typeAware
		? createTypeAwarePlugin(options)
		: createSyntacticPlugin(options);
}

// ---------------------------------------------------------------------------
// Syntactic-only path (no LanguageService, no type checker)
// ---------------------------------------------------------------------------

function createSyntacticPlugin(options?: VitePluginOptions): Plugin[] {
	let cachedTransformer: ts.TransformerFactory<ts.SourceFile> | undefined;
	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

	function getTransformer(): ts.TransformerFactory<ts.SourceFile> {
		cachedTransformer ??= createJsxToLiteralsTransformer(
			ts as unknown as TsWithInternals,
			undefined,
			{
				preset: options?.preset ?? PRESETS.Default,
				...options,
			},
		);

		return cachedTransformer;
	}

	return [
		{
			name: VITE_PLUGIN_NAME,
			enforce: 'pre',

			transform(code, id) {
				if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) return;

				const sourceFile = ts.createSourceFile(
					id,
					code,
					ts.ScriptTarget.ESNext,
					/* setParentNodes */ true,
					ts.ScriptKind.TSX,
				);

				const result = ts.transform(sourceFile, [getTransformer()], {
					jsx: ts.JsxEmit.Preserve,
				});

				const transformed = result.transformed[0];
				if (!transformed) {
					result.dispose();
					return;
				}

				const output = printer.printFile(transformed);
				result.dispose();

				return { code: output, map: null };
			},
		} as const satisfies Plugin,
	];
}

// ---------------------------------------------------------------------------
// Type-aware path (LanguageService + full checker)
// ---------------------------------------------------------------------------

function createTypeAwarePlugin(options?: VitePluginOptions): Plugin[] {
	let parsedCommandLine: ts.ParsedCommandLine;
	let service: ts.LanguageService;
	let cachedTransformer: ts.TransformerFactory<ts.SourceFile> | undefined;
	let currentProgram: ts.Program | undefined;

	/** Per-file version + content tracking for the LanguageServiceHost. */
	const fileVersions = new Map<
		string,
		{ version: number; content: string | undefined }
	>();

	/** Cached file-name list — invalidated when fileVersions changes. */
	let cachedFileNames: string[] | undefined;

	/** Snapshot cache for files read from disk (never touched by Vite). */
	const diskSnapshotCache = new Map<string, ts.IScriptSnapshot>();

	/** Compiler options overrides to keep the service slim and single-purpose. */
	const SLIM_OVERRIDES: ts.CompilerOptions = {
		// We emit JS so program.emit works with our custom transformer.
		noEmit: false,
		// Keep JSX in the AST so our transformer can see it.
		jsx: ts.JsxEmit.Preserve,

		// Let TS produce source maps so Vite can chain them.
		sourceMap: true,
		inlineSourceMap: false,
		inlineSources: true,

		// --- Memory / perf: skip everything we don't consume ---
		declaration: false,
		declarationMap: false,
		// Skip type-checking of .d.ts (lib, node_modules) — we only need
		// type *resolution*, not validation. Huge memory + time savings.
		skipLibCheck: true,
		skipDefaultLibCheck: true,
	};

	/** Get (or create) the transformer factory for the current program. */
	function getTransformer(
		program: ts.Program,
	): ts.TransformerFactory<ts.SourceFile> {
		if (currentProgram !== program) {
			// Program instance changed — invalidate.
			currentProgram = program;
			cachedTransformer = undefined;
		}

		cachedTransformer ??= createJsxToLiteralsTransformer(
			ts as unknown as TsWithInternals,
			program,
			{ preset: PRESETS.Default },
		);

		return cachedTransformer;
	}

	/**
	 * Emit a single `.tsx` source file through the LanguageService's program
	 * with our JSX→literals transformer.
	 */
	function emitFile(
		program: ts.Program,
		sourceFile: ts.SourceFile,
	): { code: string; map: string | null } | null {
		let code: string | null = null;
		let map: string | null = null;

		program.emit(
			sourceFile,
			(fileName, text) => {
				if (fileName.endsWith('.map')) map = text;
				else if (
					fileName.endsWith('.js') ||
					// TS doesn't know our transformer consumed all JSX.
					// `preserve` means it still emits `.jsx` files.
					fileName.endsWith('.jsx')
				)
					code = text;
			},
			/* cancellationToken */ undefined,
			/* emitOnlyDtsFiles */ false,
			{ before: [getTransformer(program)] },
		);

		if (code == null) return null;
		return { code, map };
	}

	return [
		{
			name: VITE_PLUGIN_NAME,
			enforce: 'pre',

			configResolved(config) {
				const projectRoot = config.root;

				const tsconfigPath = ts.findConfigFile(
					projectRoot,
					ts.sys.fileExists,
					options?.tsconfig ?? 'tsconfig.json',
				);
				if (!tsconfigPath)
					throw new Error(
						`[${VITE_PLUGIN_NAME}] Could not find tsconfig at "${projectRoot}".`,
					);

				const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
				if (configFile.error)
					throw new Error(
						ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'),
					);

				parsedCommandLine = ts.parseJsonConfigFileContent(
					configFile.config,
					ts.sys,
					projectRoot,
					SLIM_OVERRIDES,
					tsconfigPath,
				);

				// Seed initial versions from rootNames (content = undefined → read from disk).
				for (const fileName of parsedCommandLine.fileNames) {
					fileVersions.set(fileName, { version: 0, content: undefined });
				}

				const serviceHost: ts.LanguageServiceHost = {
					getScriptFileNames: () => {
						cachedFileNames ??= [...fileVersions.keys()];
						return cachedFileNames;
					},

					getScriptVersion: (fileName) =>
						(fileVersions.get(fileName)?.version ?? 0).toString(),

					getScriptSnapshot: (fileName) => {
						const entry = fileVersions.get(fileName);
						if (entry?.content !== undefined)
							return ts.ScriptSnapshot.fromString(entry.content);

						// Fall back to disk — cache the snapshot for unchanged files.
						const cached = diskSnapshotCache.get(fileName);
						if (cached) return cached;

						const text = ts.sys.readFile(fileName);
						if (text === undefined) return;

						const snapshot = ts.ScriptSnapshot.fromString(text);
						diskSnapshotCache.set(fileName, snapshot);
						return snapshot;
					},

					getCurrentDirectory: () => projectRoot,
					getCompilationSettings: () => parsedCommandLine.options,
					getDefaultLibFileName: ts.getDefaultLibFilePath,
					fileExists: ts.sys.fileExists,
					readFile: ts.sys.readFile,
					readDirectory: ts.sys.readDirectory,
					directoryExists: ts.sys.directoryExists,
					getDirectories: ts.sys.getDirectories,
				};

				service = ts.createLanguageService(
					serviceHost,
					ts.createDocumentRegistry(),
				);
			},

			transform(code, id) {
				if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) return;

				// Bump version so the LanguageService knows this file changed.
				const entry = fileVersions.get(id);
				if (entry) {
					entry.version++;
					entry.content = code;
				} else {
					// New file — add it to tracking.
					fileVersions.set(id, { version: 1, content: code });
					cachedFileNames = undefined; // invalidate name list
				}

				const program = service.getProgram();
				if (!program) return;

				const sourceFile = program.getSourceFile(id);
				if (!sourceFile) return;

				const result = emitFile(program, sourceFile);
				if (result == null) return;

				return { code: result.code, map: result.map };
			},
		} as const satisfies Plugin,
	];
}
