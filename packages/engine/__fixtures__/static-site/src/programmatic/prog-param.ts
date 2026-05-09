import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{ params: { slug: 'alpha' }, props: { title: 'Alpha' } },
		{ params: { slug: 'beta' }, props: { title: 'Beta' } },
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>Programmatic Param - ${context.props.title}</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
