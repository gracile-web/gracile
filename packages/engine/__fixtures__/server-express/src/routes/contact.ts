import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	// TODO:
	prerender: true,

	document: (context) => document({ ...context, title: 'Gracile Contact' }),

	template: () => html`
		<!--  -->
		<h1>the Contact Page</h1>

		<!--  -->
	`,
});
