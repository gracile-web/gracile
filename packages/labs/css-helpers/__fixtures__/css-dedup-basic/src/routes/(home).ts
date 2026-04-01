import '../features/my-card.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) =>
		document({ ...context, title: 'CSS Dedup Test - Home' }),

	template: () => html`
		<h1>DSD Style Dedup Test</h1>

		<my-card heading="Card 1">
			<p>First instance — should keep inline style.</p>
		</my-card>

		<my-card heading="Card 2">
			<p>Second instance — style should be deduplicated.</p>
		</my-card>

		<my-card heading="Card 3">
			<p>Third instance — also deduplicated.</p>
		</my-card>
	`,
});
