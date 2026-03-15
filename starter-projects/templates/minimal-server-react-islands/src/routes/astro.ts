import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';
import { Test1 } from '../features/test1.astro';

console.log({ Test1 });

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile - Home' }),

	template: ({ props }) => html`
		<!--  -->
		<h1>Astro</h1>

		<!--  -->
	`,
});
