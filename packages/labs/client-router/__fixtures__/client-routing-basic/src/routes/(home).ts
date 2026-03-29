import '../features/my-greetings.js';
import '../features/full-stack-widget.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';
import { topMenu } from '../features/top-menu.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Home' }),

	template: () => html`
		${topMenu()}

		<main>
			<h1>Home Page</h1>
			<p class="description">Welcome to the client routing test fixture.</p>
			<p class="home-accent">Home accent styled by sibling CSS.</p>
			<my-greetings></my-greetings>
			<full-stack-widget></full-stack-widget>
		</main>
	`,
});
