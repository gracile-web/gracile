import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	handler: {
		GET: () => {
			console.log('Hey');
			return {};
		},
	},

	document: (context) => document({ ...context, title: 'Gracile Test' }),

	template: () => html`
		<!--  -->
		<h1>Hello Gracile - Test page</h1>

		<!--  -->
	`,
});
