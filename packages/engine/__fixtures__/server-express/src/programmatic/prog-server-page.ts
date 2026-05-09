import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Programmatic About' }),

	template: (context) => html`
		<h1>Programmatic Server Page</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
