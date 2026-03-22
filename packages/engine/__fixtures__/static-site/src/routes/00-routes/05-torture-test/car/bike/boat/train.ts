import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../../../../documents/document-minimal.js';

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<h1>car / bike / boat / train</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
