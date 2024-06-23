import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

import customStylesheet from './_assets-my-el-2.scss?url';
import './_assets-my-el.js';

export default defineRoute({
	handler: {
		GET: ({ url }) => {
			return { query: url.searchParams.get('q') };
		},
	},

	document: (context) => document({ ...context, title: 'Gracile Home' }),

	template: (context) => html`
		<!--  -->

		<my-el extra-styles=${[customStylesheet].toString()}></my-el>
	`,
});
