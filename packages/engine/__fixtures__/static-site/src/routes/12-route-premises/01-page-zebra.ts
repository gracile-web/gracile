import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

// @ts-expect-error THIS IS NOT EXPOSED TO END USER (for now)
import { enabled, mode, routeImports } from 'gracile:client:routes';

import { document } from '../../documents/document-with-assets.js';

export default defineRoute({
	handler: () => ({ title: 'Hello Client Router - Zebra', foo: 'baz' }),

	document: (context) => document(context),

	template: (context) => html`
		<h1>${context.props.title}</h1>
		<hr />
		<code>${context.url.pathname}</code>
		<hr />
		<ul>
			<li>Enabled ?<code>${enabled}</code></li>
			<li>Mode<code>${mode}</code></li>
		</ul>

		<div>
			<!--  -->
			DUMP
			<pre>${JSON.stringify([...routeImports], null, 2)}</pre>
		</div>
	`,
});
