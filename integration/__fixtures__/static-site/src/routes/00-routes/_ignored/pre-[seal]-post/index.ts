import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: {
				seal: 'planet',
			},
			props: { title: '"Planet"' },
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
		<h1>${context.props.title}</h1>
		<hr />
		<code>${context.url.pathname}</code>
	`,
});
