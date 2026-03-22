import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../documents/document-minimal.js';

export default defineRoute({
	handler: (context) => ({
		title: 'foo',
		url: context.url,
	}),

	document: (context) => document(context),

	template: (context) => html`
		<h1>Hello world</h1>
		<hr />
		<code>${context.props.url.pathname}</code>

		<code>${context.props.title}</code>
	`,
});
