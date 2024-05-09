import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: { trustee: 'popular' },
			props: { title: '"Popular"' },
		},
		{
			params: { trustee: 'formal' },
			props: { title: '"Formal"' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title} (trustee)</h1>
		<hr />
		<code>${context.url.pathname}</code>
	`,
});
