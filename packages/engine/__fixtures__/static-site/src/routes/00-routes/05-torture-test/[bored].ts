import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: { bored: 'dance' },
			props: { title: '"Dance"' },
		},
		{
			params: { bored: 'creation' },
			props: { title: '"Creation"' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title} (bored) - noon</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
