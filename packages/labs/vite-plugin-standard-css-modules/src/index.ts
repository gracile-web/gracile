/**
 * @license
 * Julian Cataldo
 * SPDX-License-Identifier: ISC
 */

import { createHash } from 'node:crypto';

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
	/**
	 * Glob patterns to exclude from general transformation work.
	 *
	 * Files that contain `with { type: 'css' | 'css-lit' }` imports are still
	 * transformed even if excluded, because bundlers do not handle these import
	 * attributes natively.
	 */
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
 * Virtual module prefix for per-CSS-file singletons.
 *
 * Full ID format: `virtual:csm/<hash>` where `<hash>` is a stable
 * SHA-256 digest of `mode + '\0' + absoluteCssPath`.  A registry maps
 * each hash back to its metadata so the `load` hook can generate the
 * correct bootstrap code.
 *
 * We avoid embedding file-system paths in the virtual ID because
 * Rolldown (used by Vite 8+) misidentifies path-like virtual IDs as
 * real files and bypasses the `load` hook for export analysis.
 */
export const VIRTUAL_CSS_PREFIX = 'virtual:csm/';
const RESOLVED_VIRTUAL_CSS_PREFIX = '\0' + VIRTUAL_CSS_PREFIX;

/** Metadata stored per virtual CSS module. */
export interface VirtualCssEntry {
	cssAbsPath: string;
	useLit: boolean;
}

/** Deterministic short hash for a mode + absolute CSS path pair. */
export function virtualCssKey(mode: string, cssAbsPath: string): string {
	return createHash('sha256')
		.update(mode + '\0' + cssAbsPath)
		.digest('hex')
		.slice(0, 16);
}

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
 * Build the code for a virtual CSS module singleton.
 *
 * Every CSS file gets at most two virtual modules (one per mode: `sheet` or
 * `lit`).  All JS files that `import … with { type: 'css' }` from the same
 * CSS file share the **same** virtual module — and therefore the same
 * `CSSStyleSheet` or `CSSResult` instance, exactly like a native CSS module
 * script would behave in the browser.
 *
 * @param cssAbsPath  Absolute path of the CSS source file.
 * @param useLit      `true` → emit a Lit `CSSResult`; `false` → `CSSStyleSheet`.
 * @param dev         When set, prepend a DSD marker comment and (optionally)
 *                    inject an `import.meta.hot.accept` block for graceful HMR.
 */
export function buildVirtualModuleCode(
	cssAbsPath: string,
	useLit: boolean,
	dev?: { cssModuleId: string; injectHmr: boolean },
): string {
	const inlineSpecifier = `${cssAbsPath}?inline`;

	// In dev, prepend a marker comment so DSD <style> elements can be found.
	const markerPrefix = dev
		? JSON.stringify(`/* __csm:${dev.cssModuleId} */\n`)
		: null;
	const rawExpr = markerPrefix ? `(${markerPrefix} + __raw)` : '__raw';

	let code: string;

	code = useLit
		? `import { unsafeCSS } from 'lit';\n` +
			`import __raw from ${JSON.stringify(inlineSpecifier)};\n` +
			`const __styles = unsafeCSS(${rawExpr});\n` +
			`export default __styles;`
		: `import __raw from ${JSON.stringify(inlineSpecifier)};\n` +
			`const __sheet = new CSSStyleSheet();\n` +
			`__sheet.replaceSync(${rawExpr});\n` +
			`export default __sheet;`;

	if (dev?.injectHmr) {
		const sheetUpdate = useLit
			? `try { const __s = __styles.styleSheet; if (__s) __s.replaceSync(__css); } catch {}`
			: `__sheet.replaceSync(__css);`;

		code +=
			`\nif (import.meta.hot) {` +
			`\n  import.meta.hot.accept(${JSON.stringify(inlineSpecifier)}, async (__m) => {` +
			`\n    if (!__m) return;` +
			`\n    const __css = ${markerPrefix} + __m.default;` +
			`\n    ${sheetUpdate}` +
			`\n    (await import(${JSON.stringify(VIRTUAL_HMR_ID)})).updateDsdStyles(${JSON.stringify(dev.cssModuleId)}, __css);` +
			`\n  });` +
			`\n}`;
	}

	return code;
}

// -----------------------------------------------------------------------------
// Plugin
// -----------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function standardCssModules(options?: Options): any {
	const opts = { ...defaultOptions, ...options };

	const includeFilter = createFilter(opts.include);

	/** CSS file → Set of JS importers (for HMR). */
	const cssToImporters = new Map<string, Set<string>>();

	/** Hash → virtual CSS module metadata (shared across transform / load). */
	const cssRegistry = new Map<string, VirtualCssEntry>();

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
			if (id.startsWith(VIRTUAL_CSS_PREFIX)) return '\0' + id;
		},

		load(id, loadOptions) {
			if (id === RESOLVED_VIRTUAL_HMR_ID) return HMR_RUNTIME_CODE;

			if (id.startsWith(RESOLVED_VIRTUAL_CSS_PREFIX)) {
				const hash = id.slice(RESOLVED_VIRTUAL_CSS_PREFIX.length);
				const entry = cssRegistry.get(hash);
				if (!entry) return;

				const { cssAbsPath, useLit } = entry;
				const ssr = loadOptions?.ssr === true;

				const dev =
					isDev && opts.hmr
						? {
								cssModuleId: cssAbsPath.startsWith(root)
									? cssAbsPath.slice(root.length)
									: cssAbsPath,
								injectHmr: !ssr,
							}
						: undefined;

				return buildVirtualModuleCode(cssAbsPath, useLit, dev);
			}
		},

		async transform(code, id, transformOptions) {
			if (!includeFilter(id)) return null;
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

				// Determine output shape.
				// 1. Explicit `outputMode` option overrides everything.
				// 2. Otherwise: css-lit → CSSResult, SSR → CSSResult,
				//    client css → CSSStyleSheet.
				const useLit =
					opts.outputMode === 'CSSResult' ||
					(opts.outputMode !== 'CSSStyleSheet' && (type === 'css-lit' || ssr));

				// Rewrite the import to point to a virtual CSS module singleton.
				// All importers of the same CSS file + mode share one module
				// instance — one CSSStyleSheet or one CSSResult, like native
				// CSS module scripts.
				const mode = useLit ? 'lit' : 'sheet';
				const hash = virtualCssKey(mode, resolvedCssPath);
				cssRegistry.set(hash, { cssAbsPath: resolvedCssPath, useLit });
				const virtualId = `${VIRTUAL_CSS_PREFIX}${hash}`;

				s.overwrite(
					node.start,
					node.end,
					`import ${localName} from ${JSON.stringify(virtualId)};`,
				);

				if (opts.log) {
					// eslint-disable-next-line no-console
					console.info(
						`[standard-css-modules] ${ssr ? 'SSR' : 'Client'} (${type}):`,
						node.source.value,
						'→',
						virtualId,
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
				// eslint-disable-next-line no-console
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
