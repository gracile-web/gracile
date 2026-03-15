import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: {
				param_trustee: 'popular',
			},
			props: { title: 'One param (static route) - "Popular"' },
		},
		{
			params: {
				param_trustee: 'formal',
			},
			props: { title: 'One param (static route) - "Formal"' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title}</h1>
		<hr />
		<code>${context.url.pathname}</code>
	`,
});
