import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: {
				trustee: 'popular',
				verdict: 'yearn',
			},
			props: { title: '"Popular" - "Yearn"' },
		},
		{
			params: {
				trustee: 'popular',
				verdict: 'brave',
			},
			props: { title: '"Popular" - "Brave"' },
		},
		{
			params: {
				trustee: 'formal',
				verdict: 'guide',
			},
			props: { title: '"Formal" - "Guide"' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title}</h1>
		<hr />
		<code>${context.url.pathname}</code>
	`,
});
