/**
 * Pure, testable pipeline steps extracted from the route template renderer.
 *
 * Each function here is a focused stage of the document post-processing
 * lifecycle. They are composed by `renderRouteTemplate` in
 * `./route-template.ts`.
 *
 * @internal
 */

import { Readable } from 'node:stream';

import { html } from '@gracile/internal-utils/dummy-literals';
import { LitElementRenderer } from '@lit-labs/ssr/lib/lit-element-renderer.js';
import type { RenderInfo } from '@lit-labs/ssr';

import { PAGE_ASSETS_MARKER } from './markers.js';

// ── Regexes (re-exported for testability) ────────────────────────────

export const REGEX_TAG_SCRIPT =
	/\s?<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>\s?/gi;

export const REGEX_TAG_LINK = /\s?<link\b[^>]*?>\s?/gi;

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Concatenate multiple `Readable` streams into a single async iterable.
 */
export async function* concatStreams(...readables: Readable[]) {
	for (const readable of readables) {
		for await (const chunk of readable) {
			yield chunk;
		}
	}
}

// ── 1. Merge render info ─────────────────────────────────────────────

/**
 * Merge user-provided `RenderInfo` with the default `LitElementRenderer`.
 * Always appends `LitElementRenderer` to whatever the user supplied.
 */
export function mergeRenderInfo(
	renderInfo: Partial<RenderInfo> | undefined,
): Partial<RenderInfo> {
	return {
		...renderInfo,
		elementRenderers: [
			...(renderInfo?.elementRenderers || []),
			LitElementRenderer,
		],
	};
}

// ── 2. Inject sibling page assets ───────────────────────────────────

/** Regex matching JS/TS asset extensions. */
const REGEX_SCRIPT_EXT = /\.(js|ts|jsx|tsx)$/;
/** Regex matching CSS-like asset extensions. */
const REGEX_STYLE_EXT = /\.(css|scss|sass|less|styl|stylus)$/;

/**
 * Inject sibling page assets into the rendered document HTML.
 *
 * Inserts the `PAGE_ASSETS_MARKER` before `</head>`, then replaces it
 * with concrete `<script>` / `<link>` tags for each asset path.
 *
 * @param documentHtml  The rendered document string.
 * @param pageAssets    Array of asset file paths (e.g. `['src/pages/about.css']`).
 * @returns The document with asset tags injected (or unchanged if no assets).
 */
export function injectSiblingAssets(
	documentHtml: string,
	pageAssets: string[],
): string {
	return documentHtml
		.replace('</head>', `\n${PAGE_ASSETS_MARKER}</head>`)
		.replace(
			PAGE_ASSETS_MARKER,

			pageAssets.length > 0
				? html`<!-- PAGE ASSETS -->` +
						`${pageAssets
							.map((path) => {
								if (REGEX_SCRIPT_EXT.test(path)) {
									// prettier-ignore
									return html`		<script type="module" src="/${path}"></script>`;
								}

								if (REGEX_STYLE_EXT.test(path)) {
									// prettier-ignore
									return html`		<link rel="stylesheet" href="/${path}" />`;
								}

								// NOTE: Never called (filtered upstream in `collectRoutes`)
								return null;
							})
							.join('\n')}` +
						`<!-- /PAGE ASSETS -->\n		`
				: '',
		);
}

// ── 3. Ensure doctype ────────────────────────────────────────────────

/**
 * Prepend `<!doctype html>` if the document doesn't already start with one.
 *
 * @param documentHtml  The rendered document string.
 * @returns The document guaranteed to start with a doctype declaration.
 */
export function ensureDoctype(documentHtml: string): string {
	if (
		documentHtml.trimStart().toLocaleLowerCase().startsWith('<!doctype') ===
		false
	)
		return `<!doctype html>\n${documentHtml}`;
	return documentHtml;
}

// ── 4. Inject dev overlay ────────────────────────────────────────────

/**
 * The HMR error overlay script injected in dev mode.
 * Returns the raw HTML string for the `<script>` tag.
 */
export function devOverlaySnippet(): string {
	return html`
		<script type="module">
			if (import.meta.hot) {
				import.meta.hot.on('gracile:ssr-error', (error) => {
					console.error(error.message);
				});
				import.meta.hot.on('error', (payload) => {
					console.error(payload.err.message);
				});
			}
		</script>
	`;
}

/**
 * Inject the dev overlay script right after `<head>`.
 * Only applied when `mode === 'dev'`.
 *
 * @param documentHtml  The rendered document string.
 * @returns The document with the overlay injected.
 */
export function injectDevOverlay(documentHtml: string): string {
	return documentHtml.replace('<head>', `<head>\n${devOverlaySnippet()}`);
}

// ── 5. Inject server runtime assets ─────────────────────────────────

/**
 * For server-output builds: strip dev-time `<script type="module">` and
 * `<link rel="stylesheet">` tags, then inject the production asset string
 * before `</head>`.
 *
 * @param documentHtml     The rendered document string.
 * @param routeAssetsHtml  The production asset tags to inject.
 * @returns The document with dev assets stripped and production assets injected.
 */
export function injectServerAssets(
	documentHtml: string,
	routeAssetsHtml: string,
): string {
	return documentHtml
		.replaceAll(REGEX_TAG_SCRIPT, (s) => {
			if (s.includes(`type="module"`)) return '';
			return s;
		})
		.replaceAll(REGEX_TAG_LINK, (s) => {
			if (s.includes(`rel="stylesheet"`)) return '';
			return s;
		})
		.replace('</head>', `${routeAssetsHtml}\n</head>`);
}
