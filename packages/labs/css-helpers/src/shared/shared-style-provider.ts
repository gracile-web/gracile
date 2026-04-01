import { html, type ServerRenderedTemplate } from '@lit-labs/ssr';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export const SHARED_STYLE_CE_SCRIPT = /* js */ `{
	const __sharedStyleCache = new Map();
	class AdoptSharedStyle extends HTMLElement {
		connectedCallback() {
			const id = this.getAttribute('style-id');
			if (!id) {
				this.remove();
				return;
			}
			const root = this.getRootNode();
			const cached = __sharedStyleCache.get(id);
			if (cached) {
				root.adoptedStyleSheets.push(cached);
			} else {
				const source = root.getElementById(id);
				if (source) {
					const sheet = new CSSStyleSheet();
					sheet.replaceSync(source.textContent);
					__sharedStyleCache.set(id, sheet);
				}
			}
			this.remove();
		}
	}
	customElements.define('adopt-shared-style', AdoptSharedStyle);
}`;

/**
 * Provides the `<adopt-shared-style>` Custom Element definition inline in
 * `<head>`, enabling DSD style deduplication on the client side.
 *
 * Place in your document `<head>`. Works with `DedupLitElementRenderer`.
 *
 * On first encounter of a style (by `style-id`), it finds the inline
 * `<style id="...">` in the same shadow root, creates a `CSSStyleSheet`,
 * and caches it. On subsequent encounters (no inline `<style>` present),
 * it pushes the cached sheet to the shadow root's `adoptedStyleSheets`.
 * Then removes itself.
 *
 * @example
 *
 * ```ts
 * import { sharedStyleProvider } from '@gracile-labs/css-helpers/shared-style-provider';
 * import { html } from '@gracile/gracile/server-html';
 *
 * export const document = () => html`
 *   <!doctype html>
 *   <html lang="en">
 *     <head>
 *       ${sharedStyleProvider()}
 *     </head>
 *     <body>
 *       <route-template-outlet></route-template-outlet>
 *     </body>
 *   </html>
 * `;
 * ```
 */
export const sharedStyleProvider = (): ServerRenderedTemplate =>
	html`${unsafeHTML(/* html */ `
<script>
  ${SHARED_STYLE_CE_SCRIPT}
</script>
`)}`;

export declare abstract class AdoptSharedStyle {}
