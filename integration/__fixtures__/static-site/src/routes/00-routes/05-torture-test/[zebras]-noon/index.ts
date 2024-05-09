import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: { zebras: 'hollow' },
			props: { title: '"Hollow"' },
		},
		// {
		// 	params: { zebras: 'creation' }, // Also used in arrow. Should take priority
		// 	props: { title: '"Creation"' },
		// },
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title} (zebras) - noon</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
