/**
 * Lightweight test harness for JSX transformer tests.
 *
 * Provides two in-memory transform helpers:
 *   - `transformToLiterals`  – JSX → Lit tagged template literals
 *   - `transformToMetaJsx`   – meta-JSX dialect → framework JSX (to-jsx)
 *
 * No disk I/O, no ts-patch — just the compiler API with custom transformers.
 */

import * as ts from 'typescript';

import type { TsWithInternals, TransformerPluginConfig } from '../types.js';
import { PRESETS } from '../presets/lit.js';
import {
	createJsxToLiteralsTransformer,
	type TransformerOptions,
} from '../to-literals/to-literals.js';
import { createMetaJsxTransformer } from '../to-jsx/to-jsx.js';

const VIRTUAL_FILENAME = '/virtual/input.tsx';

/** Minimal lib typings so the compiler doesn't choke on basic types. */
const LIB_SOURCE = `
declare var console: { log(...args: any[]): void };
declare function Boolean(value: unknown): boolean;
declare var JSON: { stringify(value: any): string };
`;

const LIB_FILENAME = '/virtual/lib.d.ts';

export interface TransformResult {
	/** Only the body — auto-generated imports stripped for focused assertions. */
	body: string;
	/** The full emitted JS output (includes auto-generated imports). */
	code: string;
	/** Diagnostics from the program (type errors, etc.). */
	diagnostics: readonly ts.Diagnostic[];
	/** Only the auto-generated import lines. */
	imports: string;
}

/**
 * Normalize a template literal string for comparison.
 * Collapses internal whitespace runs to single spaces and trims.
 * @param s
 */
export function normalize(s: string): string {
	return s.replaceAll(/\s+/g, ' ').trim();
}

/**
 * Transform a JSX/TSX source string through the Lit literals transformer
 * and return the emitted JS code.
 * @param source - TSX source code (e.g. `<div title={"hello"}>world</div>`)
 * @param options - Override compiler options or the Lit preset.
 * @param options.compilerOptions
 * @param options.preset
 */
export function transformToLiterals(
	source: string,
	options: {
		beforeTransformers?: ts.TransformerFactory<ts.SourceFile>[];
		compilerOptions?: ts.CompilerOptions;
		preset?: (typeof PRESETS)['Default'];
		transformerOptions?: TransformerOptions;
	} = {},
): TransformResult {
	const compilerOptions: ts.CompilerOptions = {
		jsx: ts.JsxEmit.Preserve,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
		noEmit: false,
		strict: true,
		target: ts.ScriptTarget.ES2022,
		...options.compilerOptions,
	};

	const host = createVirtualCompilerHost(source, compilerOptions);
	const program = ts.createProgram([VIRTUAL_FILENAME], compilerOptions, host);

	const diagnostics = ts.getPreEmitDiagnostics(program);

	const transformer = createJsxToLiteralsTransformer(
		ts as unknown as TsWithInternals,
		program,
		{},
		options.preset ?? PRESETS.Default,
		options.transformerOptions,
	);

	let emittedCode = '';

	program.emit(
		undefined,
		(fileName, text) => {
			if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
				emittedCode = text;
			}
		},
		undefined,
		false,
		{ before: [...(options.beforeTransformers ?? []), transformer] },
	);

	// Normalize: trim trailing whitespace, remove sourcemap comment
	const code = emittedCode.replace(/\/\/# sourceMappingURL=.*$/m, '').trim();

	// Split auto-generated imports from body
	const lines = code.split('\n');
	const importLines: string[] = [];
	const bodyLines: string[] = [];

	for (const line of lines) {
		if (line.startsWith('import ')) {
			importLines.push(line);
		} else {
			bodyLines.push(line);
		}
	}

	return {
		body: bodyLines.join('\n').trim(),
		code,
		diagnostics,
		imports: importLines.join('\n').trim(),
	};
}

// ---------------------------------------------------------------------------
// to-jsx harness
// ---------------------------------------------------------------------------

export type MetaJsxFramework = 'preact' | 'react' | 'solid' | 'vue';

/**
 * Transform a meta-JSX source string through `createMetaJsxTransformer` and
 * return the emitted JS/JSX code.
 *
 * Compiler mode is `react-native` so JSX nodes are preserved in the output
 * exactly as the transformer left them — ready for a downstream JSX pipeline.
 *
 * @param source - TSX source with meta-JSX attributes (`on:click`, `class`, …)
 * @param options.framework - Target framework (default: `'react'`)
 * @param options.compilerOptions - Compiler option overrides
 */
export function transformToMetaJsx(
	source: string,
	options: {
		framework?: MetaJsxFramework;
		compilerOptions?: ts.CompilerOptions;
	} = {},
): TransformResult {
	const compilerOptions: ts.CompilerOptions = {
		// react-native keeps JSX nodes in the AST + emits .js (not .jsx)
		jsx: ts.JsxEmit.ReactNative,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
		noEmit: false,
		strict: false, // no JSX type bindings needed in this harness
		target: ts.ScriptTarget.ES2022,
		...options.compilerOptions,
	};

	const pluginConfig: TransformerPluginConfig & { framework?: string } = {
		framework: options.framework ?? 'react',
	};

	const host = createVirtualCompilerHost(source, compilerOptions);
	const program = ts.createProgram([VIRTUAL_FILENAME], compilerOptions, host);
	const diagnostics = ts.getPreEmitDiagnostics(program);

	const transformer = createMetaJsxTransformer(
		ts as unknown as typeof ts,
		program,
		pluginConfig,
	);

	let emittedCode = '';
	program.emit(
		undefined,
		(fileName, text) => {
			if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
				emittedCode = text;
			}
		},
		undefined,
		false,
		{ before: [transformer] },
	);

	const code = emittedCode.replace(/\/\/# sourceMappingURL=.*$/m, '').trim();

	const lines = code.split('\n');
	const importLines: string[] = [];
	const bodyLines: string[] = [];
	for (const line of lines) {
		if (line.startsWith('import ')) {
			importLines.push(line);
		} else {
			bodyLines.push(line);
		}
	}

	return {
		body: bodyLines.join('\n').trim(),
		code,
		diagnostics,
		imports: importLines.join('\n').trim(),
	};
}

function createVirtualCompilerHost(
	sourceCode: string,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_options: ts.CompilerOptions,
): ts.CompilerHost {
	const files: Record<string, ts.SourceFile> = {
		[LIB_FILENAME]: ts.createSourceFile(
			LIB_FILENAME,
			LIB_SOURCE,
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TS,
		),
		[VIRTUAL_FILENAME]: ts.createSourceFile(
			VIRTUAL_FILENAME,
			sourceCode,
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TSX,
		),
	};

	return {
		fileExists: (fileName) => fileName in files || ts.sys.fileExists(fileName),
		getCanonicalFileName: (fileName) => fileName,
		getCurrentDirectory: () => '/',
		getDefaultLibFileName: () => LIB_FILENAME,
		getNewLine: () => '\n',
		getSourceFile: (fileName, languageVersion) => {
			if (files[fileName]) return files[fileName];
			// Fall back for any real lib files (e.g. node_modules/typescript/lib)
			if (ts.sys.fileExists(fileName)) {
				const text = ts.sys.readFile(fileName)!;
				return ts.createSourceFile(fileName, text, languageVersion, true);
			}
			return;
		},
		readFile: (fileName) => {
			const sf = files[fileName];
			if (sf) return sf.text;
			return ts.sys.readFile(fileName);
		},
		useCaseSensitiveFileNames: () => true,
		writeFile: () => {
			/* noop — we capture output via the emit result */
		},
	} as const;
}
