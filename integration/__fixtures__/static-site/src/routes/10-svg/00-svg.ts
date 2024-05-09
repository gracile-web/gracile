import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../documents/document-with-assets.js';
import gracile from './_assets/gracile.svg' with { type: 'svg-lit' };
import lit from './_assets/lit.svg' with { type: 'svg-lit' };
import vite from './_assets/vite.svg' with { type: 'svg-lit' };

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<style>
			svg {
				height: 20rem;
				width: 20rem;
			}
		</style>

		<h1>Hello SVGs</h1>
		<hr />
		<code>${context.url.pathname}</code>

		<div>${gracile}</div>
		<hr />
		<div>${lit}</div>
		<hr />
		<div>${vite}</div>
	`,
});
