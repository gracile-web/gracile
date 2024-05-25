import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile Private' }),

	template: () => html`
		<!--  -->
		<h1>Private!</h1>

		<!--  -->
	`,
});
