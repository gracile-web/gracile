import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';
import { SHARED_GREETING } from '../features/_shared-helper.js';

import { LOCAL_GREETING } from './_local-helper.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Home' }),

	template: () => html`
		<main>
			<h1 id="title">Home Page</h1>
			<p id="local-greeting">${LOCAL_GREETING}</p>
			<p id="shared-greeting">${SHARED_GREETING}</p>
		</main>
	`,
});
