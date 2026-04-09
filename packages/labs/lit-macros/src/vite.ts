import { createFilter, type FilterPattern, type PluginOption } from 'vite';

import { resolveParseSync, resolveVisitor } from './resolve-deps.js';
import type { ParseSync, VisitorClass } from './resolve-deps.js';
import { transformLitMacros } from './transform/index.js';

// ---------------------------------------------------------------------------
// Plugin options
// ---------------------------------------------------------------------------

export interface LitMacrosOptions {
	/**
	 * Files to include (picomatch / minimatch pattern).
	 * @default /\.[jt]sx?$/
	 */
	include?: FilterPattern;

	/**
	 * Files to exclude (picomatch / minimatch pattern).
	 * @default /node_modules/
	 */
	exclude?: FilterPattern;

	/**
	 * Vite environment names to skip.
	 *
	 * Set to `[]` to run in every environment.
	 * @default []
	 */
	skipEnvironments?: string[];
}

// ---------------------------------------------------------------------------
// Vite plugin
// ---------------------------------------------------------------------------

/**
 * Vite plugin that compiles Lit decorators (`@customElement`,
 * `@property`, `@state`) into their zero-runtime static equivalents:
 *
 * - `@customElement('tag')` → `customElements.define('tag', Class)`
 * - `@property(opts)`       → `static properties = { field: opts }`
 * - `@state()`              → `static properties = { field: {state: true} }`
 *
 * Runs at `enforce: 'pre'` so the transform happens before Vite / OXC
 * processes TypeScript or standard-decorator syntax.
 *
 * Powered by OXC (via `rolldown/utils` in Vite 8+, or standalone
 * `oxc-parser` as fallback).
 */
export function litMacros(options: LitMacrosOptions = {}): PluginOption {
	const filter = createFilter(
		options.include ?? /\.[jt]sx?$/,
		options.exclude ?? /node_modules/,
	);
	const skipEnvs = new Set(options.skipEnvironments);

	let parseSync: ParseSync;
	let Visitor: VisitorClass;

	return {
		name: 'vite-plugin-lit-macros',
		enforce: 'pre',

		async buildStart() {
			[parseSync, Visitor] = await Promise.all([
				resolveParseSync(),
				resolveVisitor(),
			]);
		},

		transform(code, id) {
			if (skipEnvs.has(this.environment.name)) return;
			if (!filter(id)) return;

			const result = transformLitMacros(code, parseSync, Visitor, {
				sourceFileName: id,
			});

			if (!result) return;
			return { code: result.code, map: result.map };
		},
	};
}
