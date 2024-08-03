import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

import customStylesheet from './_assets-methods-my-el-2.scss?url';
import './_assets-methods-my-el.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile Assets' }),

	template: (context) => html`
		<!--  -->

		<my-el extra-styles=${[customStylesheet].toString()}></my-el>
	`,
});
