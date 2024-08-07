/* eslint-disable import/no-extraneous-dependencies */

import { html, type ServerRenderedTemplate } from '@lit-labs/ssr';
import { html as LitHtml, LitElement } from 'lit';

// FIXME: cannot be used with `unsafeHTML`, so must be duplicated…
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
