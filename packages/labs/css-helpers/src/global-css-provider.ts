import { pageAssetsCustomLocation } from '@gracile/server/document';
// TODO: Make test for ordering possible discrepencies between dev/build.
// * It will collect all declared `<link>` **before** this helper, in the template.
// * This is useful if you want to exclude

import { html, type ServerRenderedTemplate } from '@lit-labs/ssr';

// From: https://eisenbergeffect.medium.com/using-global-styles-in-shadow-dom-5b80e802e89d
/**
 * Will declare the `<adopt-global-styles>` Custom Element eagerly.
 *
 * Use it in conjunction with `<adopt-global-styles>` in your Custom Elements
 * Shadow roots.
 *
 * @example
 * ```js
 * import { globalStylesProvider } from '@gracile/gracile/document';
 * import { html } from '@gracile/gracile/server-html';
 *
 * export const document = () => html`
 * 	<!doctype html>
 * 	<html lang="en">
 * 		<head>
 * 			<title>My page</title>
 * 			<!-- ... -->
 *
 * 			${globalStylesProvider()}
 * 		</head>
 *
 * 		<body>
 * 			<route-template-outlet></route-template-outlet>
 * 		</body>
 * 	</html>
 * `;
 * ```
 */
export const globalStylesProvider = (): ServerRenderedTemplate => html`
	${pageAssetsCustomLocation() /* BEFORE! So everything is collected */}

	<script>
		{
			let globalSheets = null;
			function getGlobalStyleSheets() {
				if (globalSheets === null)
					globalSheets = [...document.styleSheets].map((x) => {
						const sheet = new CSSStyleSheet();
						sheet.replaceSync(
							[...x.cssRules].map((rule) => rule.cssText).join(' '),
						);
						return sheet;
					});
				return globalSheets;
			}
			class AdoptGlobalStyles extends HTMLElement {
				connectedCallback() {
					this.getRootNode().adoptedStyleSheets.push(...getGlobalStyleSheets());
					this.remove();
				}
			}
			customElements.define('adopt-global-styles', AdoptGlobalStyles);
		}
	</script>
`;

/**
 * An helper that you can use inside any Shadow Root host, eagerly,
 * so it shares the same stylesheet as the ones used globally by
 * the document, in the Light DOM.
 *
 * You have to use it with `globalStylesProvider`, in your document head,
 * so that the helper is defined inline, which prevents FOUC.
 *
 * @example
 * ```ts
 * export class MyGreetings extends LitElement {
 * 	render() {
 * 		return html`
 * 			<adopt-global-styles></adopt-global-styles>
 *
 * 			<div class="my-global-class">Hello!</div>
 * 		`;
 * 	}
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export declare abstract class AdoptGlobalStyles {}
