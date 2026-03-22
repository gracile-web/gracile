import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	prerender: true,

	document: (context) => document({ ...context, title: 'Gracile About' }),

	template: () => html`
		<!--  -->
		<h1>the About Page</h1>

		<!--  -->
	`,
});
