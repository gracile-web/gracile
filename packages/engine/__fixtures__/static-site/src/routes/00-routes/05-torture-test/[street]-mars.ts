import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: { street: 'dance' },
			props: { title: '"Dance"' },
		},
		{
			params: { street: 'creation' },
			props: { title: '"Creation"' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title} (zebra) - noon</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
