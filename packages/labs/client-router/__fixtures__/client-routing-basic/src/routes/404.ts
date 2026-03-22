import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: '404 Not Found' }),

	template: (context) => html`
		<main>
			<h1>404 — Not Found</h1>
			<p><code>${context.url.toString()}</code> does not exist.</p>
			<a href="/">Go home</a>
		</main>
	`,
});
