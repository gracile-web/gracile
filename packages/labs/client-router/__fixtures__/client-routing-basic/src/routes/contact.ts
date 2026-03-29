import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';
import { topMenu } from '../features/top-menu.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Contact' }),

	template: () => html`
		${topMenu()}

		<main>
			<h1>Contact Page</h1>
			<p class="description">Get in touch through the contact page.</p>
			<ul class="contact-list">
				<li>Email: test@example.com</li>
				<li>Phone: 555-0123</li>
			</ul>
			<client-only-widget></client-only-widget>
		</main>
	`,
});
