import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: {
				param_test: 'jupiter',
			},
			props: { title: 'One param (static route) - Jupiter' },
		},
		{
			params: {
				param_test: 'omega',
			},
			props: { title: 'One param (static route) - Omega' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title}</h1>
		<hr />
		<code>${context.url.pathname}</code>
	`,
});
