import { LitElementRenderer } from '@lit-labs/ssr/lib/lit-element-renderer.js';
import type { RenderInfo } from '@lit-labs/ssr/lib/render-value.js';
import type { ThunkedRenderResult } from '@lit-labs/ssr/lib/render-result.js';

/**
 * Per-render-pass style registry, keyed on the `renderInfo` object reference.
 *
 * `mergeRenderInfo()` in Gracile's engine creates a fresh object per render
 * via spread, so each page render gets its own `Set`.
 * The `WeakMap` ensures automatic GC after the render completes.
 */
const registries = new WeakMap<object, Set<string>>();

function getRegistry(renderInfo: RenderInfo): Set<string> {
	let set = registries.get(renderInfo);
	if (!set) {
		set = new Set();
		registries.set(renderInfo, set);
	}
	return set;
}

const STYLE_ID_PREFIX = '__lit-s-';

/**
 * A `LitElementRenderer` subclass that deduplicates `<style>` blocks in
 * Declarative Shadow DOM output.
 *
 * - **First occurrence** of a given tag's styles: emits `<style id="__lit-s-{tag}">…</style>`
 *   followed by `<adopt-shared-style style-id="__lit-s-{tag}">` (seeds browser cache).
 * - **Subsequent occurrences**: replaces the `<style>` block with
 *   `<adopt-shared-style style-id="__lit-s-{tag}">` (adopts from cache).
 *
 * Place **before** the default `LitElementRenderer` in `elementRenderers`.
 * Pair with `sharedStyleProvider()` in the document `<head>`.
 *
 * @example
 *
 * ```ts
 * // vite.config.ts (via islands-style plugin registration)
 * import { DedupLitElementRenderer } from '@gracile-labs/css-helpers/dedup-renderer';
 *
 * gracile({
 *   litSsr: {
 *     renderInfo: { elementRenderers: [DedupLitElementRenderer] },
 *   },
 * })
 * ```
 */
export class DedupLitElementRenderer extends LitElementRenderer {
	override renderShadow(renderInfo: RenderInfo): ThunkedRenderResult {
		const result = super.renderShadow(renderInfo);

		// No styles case — super returns [renderThunk] only.
		const styleOpenIdx = result.indexOf('<style>');
		if (styleOpenIdx === -1) return result;

		const styleCloseIdx = result.indexOf('</style>');
		if (styleCloseIdx === -1) return result;

		const tagName = this.tagName;
		const styleId = STYLE_ID_PREFIX + tagName;
		const registry = getRegistry(renderInfo);

		const adopter = /* html */ `<adopt-shared-style style-id="${styleId}"></adopt-shared-style>`;

		if (!registry.has(tagName)) {
			// First occurrence: keep <style> but add an id, append adopter.
			registry.add(tagName);
			result[styleOpenIdx] = `<style id="${styleId}">`;
			result.splice(styleCloseIdx + 1, 0, adopter);
			return result;
		}

		// Subsequent: remove the entire <style>…</style> range, insert adopter.
		const removeCount = styleCloseIdx - styleOpenIdx + 1;
		result.splice(styleOpenIdx, removeCount, adopter);
		return result;
	}
}
