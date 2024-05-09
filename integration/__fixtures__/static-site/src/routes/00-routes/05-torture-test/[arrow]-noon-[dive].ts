import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: { arrow: 'edge', dive: 'plumber' },
			props: { title: '"Edge" - "Plumber"' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title} (arrow) - (noon)</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
