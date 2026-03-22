import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: { vast: 'done' },
			props: { title: '"Done" [vast]' },
		},
		// {
		// 	params: { arrow: 'creation' },
		// 	props: { title: '"Creation"' },
		// },
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title}</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
