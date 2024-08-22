import { html, type ServerRenderedTemplate } from '@lit-labs/ssr';

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
