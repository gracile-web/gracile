import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: {
				seal: 'partner',
			},
			props: { title: '"Partner"' },
		},
		{
			params: {
				seal: 'instrument',
			},
			props: { title: '"Instrument"' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>"Ideal" - "Partner" - "Clear"</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
