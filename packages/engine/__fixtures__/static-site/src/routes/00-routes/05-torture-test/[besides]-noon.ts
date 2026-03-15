import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: { besides: 'year' },
			props: { title: '"Year" [besides]' },
		},
		{
			params: { besides: 'month' },
			props: { title: '"Month" [besides]' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title}</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
