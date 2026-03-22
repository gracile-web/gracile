import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../documents/document-minimal.js';

export default defineRoute({
	handler: {
		GET: (context) => ({
			title: 'foo',
			url: context.url,
		}),
	},

	document: (context) => document(context),

	template: (context) => html`
		<h1>Hello world</h1>
		<hr />
		<code>${context.props.GET.url.pathname}</code>

		<code>${context.props.GET.title}</code>
	`,
});
