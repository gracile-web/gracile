/* eslint-disable import/no-extraneous-dependencies */

import { html as LitHtml, LitElement } from 'lit';

export { globalStylesProvider, pageAssetsCustomLocation } from './assets.js';

/**
 * Server-rendered page marker
 */
export class RouteTemplateOutlet extends LitElement {
	// eslint-disable-next-line class-methods-use-this
	render() {
		return LitHtml`Something went wrong during server side rendering!`;
	}
}

// TODO: Proper typings helper, e.g:
// export const document: DocumentTemplate<{ ... }> = (options) => html`...`;
// export type { DocumentTemplate } from '@gracile/engine/routes/route';
