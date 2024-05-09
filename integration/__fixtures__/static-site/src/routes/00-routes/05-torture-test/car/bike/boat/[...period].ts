import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../../../../../documents/document-minimal.js';

export default defineRoute({
	staticPaths: () => [
		{
			params: { period: 'fog' },
			props: { title: 'car / bike / boat / "Fog"' },
		},
		{
			params: { period: 'rain' },
			props: { title: 'car / bike / boat / "Rain"' },
		},
	],

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title}</h1>
		<hr />
		<code>${context.url.pathname}</code>
	`,
});
