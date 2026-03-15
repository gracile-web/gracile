import './_my-widget.js';

import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from './_document.js';

export default defineRoute({
	document: (context) => document(context),

	template: () => html`
		<h1>CE Tracker</h1>
		<my-widget></my-widget>
	`,
});
