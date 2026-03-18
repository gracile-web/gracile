import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';
import { topMenu } from '../features/top-menu.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'About' }),

	template: () => html`
		${topMenu()}

		<main>
			<h1>About Page</h1>
			<p class="description">
				This is the about page for the client routing test fixture.
			</p>
		</main>
	`,
});
