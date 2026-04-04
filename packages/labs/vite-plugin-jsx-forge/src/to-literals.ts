// TODO: When other transformers land, extract and share TS sidecar builder.
import * as ts from 'typescript';
import { createJsxToLiteralsTransformer } from 'jsx-forge/to-literals';
import { PRESETS } from 'jsx-forge/presets/lit';
import type { TsWithInternals } from 'jsx-forge/types';
import type { Plugin } from 'vite';

const VITE_PLUGIN_NAME = 'vite-plugin-jsx-forge--to-literals';

export interface VitePluginOptions {
	/**
	 * Path to the tsconfig to use for the TS Program.
	 * Defaults to `'tsconfig.json'` resolved from `root`.
	 */
	tsconfig?: string;
}

/**
 * Vite plugin that transforms `.tsx` JSX into Lit tagged template literals.
 *
 * Creates a TypeScript `Program` for type-aware JSX transformation, then uses
 * `program.emit` (single-file, in-memory) with the jsx-forge transformer.
 * The output is JS. Vite's esbuild/OXC step passes it through unchanged.
 * No `@rollup/plugin-typescript` or `ts-patch` needed.
 */
export function gracileJsxTs(options?: VitePluginOptions): Plugin[] {
	let program: ts.Program;
	let compilerHost: ts.CompilerHost;
	let parsedCommandLine: ts.ParsedCommandLine;
	let projectRoot: string;
	let cachedTransformer: ts.TransformerFactory<ts.SourceFile> | undefined;

	/** Compiler options overrides to keep the program slim and single-purpose. */
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

	/** (Re-)create the TS Program from the parsed tsconfig. */
	function buildProgram(): void {
		// Reuse the host across rebuilds; it's cheap to keep.
		compilerHost ??= ts.createCompilerHost(parsedCommandLine.options);

		program = ts.createProgram({
			rootNames: parsedCommandLine.fileNames,
			options: parsedCommandLine.options,
			host: compilerHost,
			oldProgram: program, // incremental reuse
		});

		// Invalidate transformer cache when the program changes.
		cachedTransformer = undefined;
	}

	/** Get (or create) the transformer factory for the current program. */
	function getTransformer(): ts.TransformerFactory<ts.SourceFile> {
		cachedTransformer ??= createJsxToLiteralsTransformer(
			ts as unknown as TsWithInternals,
			program,
			{},
			PRESETS.Default,
		);

		return cachedTransformer;
	}

	/**
	 * Emit a single `.tsx` source file through the program with our
	 * JSX→literals transformer. Captures JS output in memory.
	 */
	function emitFile(
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
					// `preserve` means it still emits `.jsx` files, which get passed to
					// Vite pipeline.
					fileName.endsWith('.jsx')
				)
					code = text;
			},
			/* cancellationToken */ undefined,
			/* emitOnlyDtsFiles */ false,
			{ before: [getTransformer()] },
		);

		if (code == null) return null;
		return { code, map };
	}

	return [
		{
			name: VITE_PLUGIN_NAME,
			enforce: 'pre',

			configResolved(config) {
				projectRoot = config.root;

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

				buildProgram();
			},

			transform(code, id) {
				if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) return;

				let sourceFile = program.getSourceFile(id);

				if (!sourceFile || sourceFile.text !== code) {
					// Either:
					// - File is unknown (new .tsx added, or .ts renamed to .tsx)
					// - Source is stale (HMR / upstream Vite plugin changed it)
					// Patch the host and do a cheap incremental rebuild.
					const fresh = ts.createSourceFile(
						id,
						code,
						parsedCommandLine.options.target ?? ts.ScriptTarget.ES2022,
						/* setParentNodes */ true,
						ts.ScriptKind.TSX,
					);

					const origGetSourceFile = compilerHost.getSourceFile;
					compilerHost.getSourceFile = (fileName, languageVersion, ...rest) => {
						if (fileName === id) return fresh;

						return origGetSourceFile.call(
							compilerHost,
							fileName,
							languageVersion,
							...rest,
						);
					};

					// Ensure the file is in rootNames so the program includes it.
					if (!parsedCommandLine.fileNames.includes(id)) {
						parsedCommandLine.fileNames.push(id);
					}

					// Stale module resolution cache could serve wrong results
					// if an import was added/removed. Clear it for the rebuild.
					compilerHost.getModuleResolutionCache?.()?.clear?.();

					buildProgram();
					sourceFile = program.getSourceFile(id);

					// Restore — don't leak the patch across transform calls.
					compilerHost.getSourceFile = origGetSourceFile;
				}

				if (!sourceFile) return;

				const result = emitFile(sourceFile);
				if (result == null) return;

				return { code: result.code, map: result.map };
			},
		} as const satisfies Plugin,
	];
}
