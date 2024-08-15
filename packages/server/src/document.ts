/* eslint-disable import/no-extraneous-dependencies */

import { html, type ServerRenderedTemplate } from '@lit-labs/ssr';
import { html as LitHtml, LitElement } from 'lit';

// FIXME: cannot be used with `unsafeHTML`, so must be duplicated…

/**
 * Overrides the default location for routes sibling assets, which is normally
 * right before the closing `</head>` tag.
 *
 * @example
 *
 * ```ts twoslash
 * import { pageAssetsCustomLocation } from '@gracile/gracile/document';
 * import { html } from '@gracile/gracile/server-html';
 *
 * export const document = (_props) => html`
 * 	<!doctype html>
 * 	<html lang="en">
 * 		<head>
 * 			<!-- ... -->
 *
 * 			<!-- NOTE: Route sibling assets injection marker.  -->
 * 			${pageAssetsCustomLocation()}
 *
 * 			<!-- ... -->
 * 		</head>
 *
 * 		<body>
 * 			<route-template-outlet></route-template-outlet>
 * 		</body>
 * 	</html>
 * `;
 *
 * ```
 */
export const pageAssetsCustomLocation = (): ServerRenderedTemplate =>
	html`<!--__GRACILE_PAGE_ASSETS__-->`;

// ---

/**
 * Server-rendered page marker
 */
export class RouteTemplateOutlet extends LitElement {
	// eslint-disable-next-line class-methods-use-this
	render() {
		return LitHtml`Something went wrong during server side rendering!`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'route-template-outlet': RouteTemplateOutlet;
	}
}

// TODO: Proper typings helper, e.g:
// export const document: DocumentTemplate<{ ... }> = (options) => html`...`;
// export type { DocumentTemplate } from '@gracile/engine/routes/route';
