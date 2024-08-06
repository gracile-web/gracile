/* eslint-disable import/no-extraneous-dependencies */

import { requestIdleCallback } from '@gracile/client/polyfills/request-idle-callback.raw';
import { pageAssets } from '@gracile/engine/render/route-template';
import { html } from '@lit-labs/ssr';
import { html as LitHtml, LitElement } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

// TODO: parametrize for prod/dev (using esm-env? import.meta.ENV? NODE_ENV?…)
const errors = html`
	<script type="module">
		if (import.meta.hot) {
			import.meta.hot.on('gracile:ssr-error', (error) => {
				throw new Error(error.message);
			});
		}
	</script>
`;
const fullHydration = html`
	<script type="module">
		// HYDRATE
		import '@gracile/gracile/_internals/hydrate';
	</script>
`;

const polyfills = {
	declarativeShadowDom: html`
		<script type="module">
			// DECLARATIVE SHADOW DOM
			import { checkDsd } from '@gracile/gracile/_internals/polyfills/declarative-shadow-dom';
			checkDsd();
		</script>
	`,

	requestIdleCallback: html`
		${unsafeHTML(`
      <script>
				// REQUEST IDLE CALLBACK - POLYFILL
				${requestIdleCallback}
      </script>
			`)}
	`,
};

// ---

export const helpers = {
	fullHydration,
	polyfills,
	pageAssets,
	dev: {
		// NOTE: Unused for now.
		errors,
	},
	// SSR_OUTLET: SSR_OUTLET_MARKER,
};

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
