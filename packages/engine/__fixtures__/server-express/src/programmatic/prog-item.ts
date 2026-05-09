import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) =>
		document({ ...context, title: `Programmatic - ${context.params.item}` }),

	template: (context) => html`
		<h1>Programmatic Item - ${context.params.item}</h1>

		<hr />
		<code>${context.url.pathname}</code>
	`,
});
