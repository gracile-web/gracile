/**
 * @license
 * Julian Cataldo
 * SPDX-License-Identifier: ISC
 */

import type { ImportAttribute, ImportDeclaration } from '@oxc-project/types';
import MagicString from 'magic-string';
import { createFilter, type Plugin } from 'vite';
import type { parseSync } from 'rolldown/utils';

// ---------------------------------------------------------------------------
// Lazy parser resolution: prefer rolldown (ships with Vite 8) over oxc-parser
// ---------------------------------------------------------------------------

type ParseSync = typeof parseSync;

let _parseSync: ParseSync | undefined;

/** Resolve the OXC parser — bundled in Rolldown (Vite 8) or standalone. */
export async function resolveParser(): Promise<ParseSync> {
	if (_parseSync) return _parseSync;

	try {
		const mod = await import('rolldown/utils');
		_parseSync = mod.parseSync;
	} catch {
		const mod = await import('oxc-parser');
		_parseSync = mod.parseSync;
	}

	return _parseSync;
}

// -----------------------------------------------------------------------------
// Public types
// -----------------------------------------------------------------------------

export type ImportAttributeType = 'css' | 'css-lit';

export interface Options {
	/** Glob patterns for JS/TS files to transform (default: all JS/TS). */
	include?: string[];
	/** Glob patterns to exclude from transformation. */
	exclude?: string[];
	/**
	 * Force every CSS import to produce a specific output, regardless of
	 * the per-import `type` attribute or SSR auto-detection.
	 *
	 * - `'CSSStyleSheet'` — always emit a constructable `CSSStyleSheet`
	 *   (even during SSR — make sure a polyfill is available).
	 * - `'CSSResult'` — always emit a Lit `CSSResult` via `unsafeCSS()`.
	 *
	 * When unset (default), the output is determined per-import:
	 * `type: 'css'` → `CSSStyleSheet` on the client, `CSSResult` in SSR;
	 * `type: 'css-lit'` → `CSSResult` everywhere.
	 */
	outputMode?: 'CSSStyleSheet' | 'CSSResult';
	/** Enable verbose logging. */
	log?: boolean;
	/** **Experimental**. Enable HMR (Hot Module Replacement) for CSS modules. */
	hmr?: boolean;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CSS_EXTENSIONS_RE = /\.(css|scss|sass|less|styl|stylus|pcss|sss)$/;

/** Hints that must ALL appear in source text for it to possibly contain a CSS import attribute. */
const PRE_FILTER_HINTS = [
	'import',
	'with',
	'type',
	'.css',
	'.scss',
	'.sass',
	'.less',
	'.styl',
	'.pcss',
	'.sss',
] as const;

/** Fast check: returns `true` if `code` contains all required keyword hints AND at least one CSS extension. */
function maybeCssImportAttributes(code: string): boolean {
	// Keywords that are always present in `import x from './f.css' with { type: 'css' }`
	if (!code.includes('import')) return false;
	if (!code.includes('with')) return false;
	if (!code.includes('type')) return false;

	// At least one CSS-like extension must appear in the specifier
	for (let i = 3; i < PRE_FILTER_HINTS.length; i++) {
		if (code.includes(PRE_FILTER_HINTS[i]!)) return true;
	}
	return false;
}

// NOTE: Ignore-comment feature is kept but disabled — Vite/Rolldown can't
// resolve the raw `with { type: 'css' }` import that gets left behind.
// Uncomment when bundlers support native import attributes.

// /** Comment directive to skip transformation of a specific import. */
// export const IGNORE_COMMENT = '@css-modules-ignore';

export const defaultOptions: Required<Omit<Options, 'outputMode'>> = {
	include: ['**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}'],
	exclude: ['**/node_modules/**'],
	hmr: false,
	log: false,
};

// -----------------------------------------------------------------------------
// HMR — virtual module for DSD (Declarative Shadow DOM) reconciliation
// -----------------------------------------------------------------------------

const VIRTUAL_HMR_ID = 'virtual:standard-css-modules/hmr';
const RESOLVED_VIRTUAL_HMR_ID = '\0' + VIRTUAL_HMR_ID;

/**
 * Client-side runtime that traverses open shadow roots and updates `<style>`
 * elements whose content contains a matching CSS module marker comment.
 * This covers the gap between DSD delivery and Lit hydration — once hydrated,
 * `adoptedStyleSheets` takes precedence and is updated via `replaceSync`.
 */
const HMR_RUNTIME_CODE = /* js */ String.raw`
export function updateDsdStyles(id, newCss) {
  const marker = "/* __csm:" + id + " */";
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      const sr = el.shadowRoot;
      if (!sr) continue;
      for (const style of sr.querySelectorAll("style")) {
        if (style.textContent !== null && style.textContent.includes(marker)) {
          style.textContent = marker + "\n" + newCss;
        }
      }
      walk(sr);
    }
  };
  walk(document);
}
`;

// -----------------------------------------------------------------------------
// Helpers (exported for testing)
// -----------------------------------------------------------------------------

export interface CssImportMatch {
	node: ImportDeclaration;
	type: ImportAttributeType;
}

// /**
//  * Check whether the source text immediately before `offset` contains
//  * a `// @css-modules-ignore` or `/* @css-modules-ignore */` comment
//  * on the preceding line.
//  */
// export function hasIgnoreComment(code: string, offset: number): boolean {
// 	let i = offset - 1;
// 	while (i >= 0 && (code[i] === ' ' || code[i] === '\t')) i--;
// 	if (i >= 0 && code[i] !== '\n') return false;
// 	i--;
// 	const lineEnd = i + 1;
// 	while (i >= 0 && code[i] !== '\n') i--;
// 	const line = code.slice(i + 1, lineEnd).trim();
// 	return line.includes(IGNORE_COMMENT);
// }

/**
 * Returns the import-attribute `type` value if the attribute list
 * contains `type: 'css'` or `type: 'css-lit'`, otherwise `null`.
 */
export function getCssAttributeType(
	attributes: ImportAttribute[],
): ImportAttributeType | null {
	for (const attr of attributes) {
		const key =
			attr.key.type === 'Identifier'
				? attr.key.name
				: (attr.key as { value: string }).value;
		if (key !== 'type') continue;

		const val = attr.value.value;
		if (val === 'css' || val === 'css-lit') return val;
	}
	return null;
}

/**
 * Scan the top-level body for CSS import declarations that carry a
 * recognised `with { type: … }` attribute.
 */
export function findCssImports(
	body: readonly ImportDeclaration[],
): CssImportMatch[] {
	const matches: CssImportMatch[] = [];

	for (const node of body) {
		if (node.type !== 'ImportDeclaration') continue;
		if (!CSS_EXTENSIONS_RE.test(node.source.value)) continue;
		// if (hasIgnoreComment(code, node.start)) continue;

		const type = getCssAttributeType(node.attributes);
		if (type) matches.push({ node, type });
	}

	return matches;
}

/**
 * Build the replacement source text for a single CSS import.
 *
 * When `dev` is provided (dev-server mode):
 * - A CSS comment marker (`/* __csm:ID *\/`) is prepended to the CSS content
 *   for DSD `<style>` identification.
 * - When `dev.injectHmr` is true (client-side only), an
 *   `import.meta.hot.accept` block is appended so CSS changes are applied
 *   in-place via `CSSStyleSheet.replaceSync()` — no full page reload.
 */
export function buildReplacement(
	localName: string,
	inlineSpecifier: string,
	useLit: boolean,
	dev?: { cssModuleId: string; injectHmr: boolean },
): string {
	// In dev, prepend a marker comment so DSD <style> elements can be found.
	const markerPrefix = dev
		? JSON.stringify(`/* __csm:${dev.cssModuleId} */\n`)
		: null;
	const rawExpr = markerPrefix
		? `(${markerPrefix} + __raw_${localName})`
		: `__raw_${localName}`;

	let code: string;

	code = useLit
		? `import { unsafeCSS as __unsafeCSS_${localName} } from 'lit';\n` +
			`import __raw_${localName} from ${JSON.stringify(inlineSpecifier)};\n` +
			`const ${localName} = __unsafeCSS_${localName}(${rawExpr});`
		: // -----------------------------------------------------------------------
			`import __raw_${localName} from ${JSON.stringify(inlineSpecifier)};\n` +
			`const __sheet_${localName} = new CSSStyleSheet();\n` +
			`__sheet_${localName}.replaceSync(${rawExpr});\n` +
			`const ${localName} = __sheet_${localName};`;

	if (dev?.injectHmr) {
		code += buildHmrBlock(
			localName,
			inlineSpecifier,
			dev.cssModuleId,
			useLit,
			markerPrefix!,
		);
	}

	return code;
}

/**
 * Generate the `import.meta.hot.accept` block for graceful CSS HMR.
 *
 * - **CSSStyleSheet** (`type: 'css'`): calls `replaceSync()` on the existing
 *   sheet instance — every `adoptedStyleSheets` consumer sees the update.
 * - **CSSResult** (`type: 'css-lit'`): accesses the lazily-cached
 *   `styleSheet` property and calls `replaceSync()` if a component instance
 *   has already been created.
 * - **DSD fallback**: dynamically imports the virtual HMR helper to reconcile
 *   `<style>` elements inside open shadow roots.
 */
function buildHmrBlock(
	localName: string,
	inlineSpecifier: string,
	cssModuleId: string,
	useLit: boolean,
	markerPrefix: string,
): string {
	const sheetUpdate = useLit
		? `try { const __s = ${localName}.styleSheet; if (__s) __s.replaceSync(__css); } catch {}`
		: `__sheet_${localName}.replaceSync(__css);`;

	return (
		`\nif (import.meta.hot) {` +
		`\n  import.meta.hot.accept(${JSON.stringify(inlineSpecifier)}, async (__m) => {` +
		`\n    if (!__m) return;` +
		`\n    const __css = ${markerPrefix} + __m.default;` +
		`\n    ${sheetUpdate}` +
		`\n    (await import(${JSON.stringify(VIRTUAL_HMR_ID)})).updateDsdStyles(${JSON.stringify(cssModuleId)}, __css);` +
		`\n  });` +
		`\n}`
	);
}

// -----------------------------------------------------------------------------
// Plugin
// -----------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function standardCssModules(options?: Options): any {
	const opts = { ...defaultOptions, ...options };

	const filter = createFilter(opts.include, opts.exclude);

	/** CSS file → Set of JS importers (for HMR). */
	const cssToImporters = new Map<string, Set<string>>();

	let root = '';
	let isDev = false;

	return {
		name: 'standard-css-modules',
		enforce: 'pre',

		configResolved(config) {
			root = config.root;
			isDev = config.command === 'serve';
		},

		resolveId(id) {
			if (id === VIRTUAL_HMR_ID) return RESOLVED_VIRTUAL_HMR_ID;
		},

		load(id) {
			if (id === RESOLVED_VIRTUAL_HMR_ID) return HMR_RUNTIME_CODE;
		},

		async transform(code, id, transformOptions) {
			if (!filter(id)) return null;
			// Fast pre-filter: skip files that can't contain CSS import attributes.
			if (!maybeCssImportAttributes(code)) return null;

			const parseSync = await resolveParser();
			const { program } = parseSync(id, code);
			const cssImports = findCssImports(program.body as ImportDeclaration[]);
			if (cssImports.length === 0) return null;

			const s = new MagicString(code);
			const ssr = transformOptions?.ssr === true;

			for (const { node, type } of cssImports) {
				const localName = node.specifiers[0]?.local?.name;
				if (!localName) continue;

				// Resolve the CSS file through Vite's pipeline.
				const resolved = await this.resolve(node.source.value, id);
				if (!resolved) continue;

				// Track CSS → JS dependency for HMR.
				const resolvedCssPath = resolved.id.split('?')[0] ?? resolved.id;
				let importers = cssToImporters.get(resolvedCssPath);
				if (!importers) {
					importers = new Set();
					cssToImporters.set(resolvedCssPath, importers);
				}
				importers.add(id);

				const inlineSpecifier = `${node.source.value}?inline`;

				// Determine output shape.
				// 1. Explicit `outputMode` option overrides everything.
				// 2. Otherwise: css-lit → CSSResult, SSR → CSSResult,
				//    client css → CSSStyleSheet.
				const useLit =
					opts.outputMode === 'CSSResult' ||
					(opts.outputMode !== 'CSSStyleSheet' && (type === 'css-lit' || ssr));

				// In dev mode (with hmr enabled), inject CSS marker for DSD
				// reconciliation and HMR accept handler for graceful CSS swapping.
				const dev =
					isDev && opts.hmr
						? {
								cssModuleId: resolvedCssPath.startsWith(root)
									? resolvedCssPath.slice(root.length)
									: resolvedCssPath,
								injectHmr: !ssr,
							}
						: undefined;

				s.overwrite(
					node.start,
					node.end,
					buildReplacement(localName, inlineSpecifier, useLit, dev),
				);

				if (opts.log) {
					console.info(
						`[standard-css-modules] ${ssr ? 'SSR' : 'Client'} (${type}):`,
						node.source.value,
						'in',
						id,
					);
				}
			}

			return {
				code: s.toString(),
				map: s.generateMap({ hires: 'boundary' }),
			};
		},

		handleHotUpdate({ file }) {
			if (!opts.hmr) return;
			if (!CSS_EXTENSIONS_RE.test(file)) return;

			const importers = cssToImporters.get(file);
			if (!importers?.size) return;

			if (opts.log) {
				console.info(
					`[standard-css-modules] HMR: ${file} → graceful CSS swap via`,
					[...importers],
				);
			}

			// Return undefined — let Vite's default HMR propagation handle it.
			// The ?inline module is invalidated automatically (shares the same
			// `file` property), and our import.meta.hot.accept handlers in the
			// importing JS modules pick up the dep update gracefully.
		},
	} as const satisfies Plugin;
}
