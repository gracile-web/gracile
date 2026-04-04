import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) =>
		document({ ...context, title: 'JSX Accuracy - Plain' }),

	template: () => html`
		<main>
			<section id="plain-lit">
				<p>This route uses plain Lit html, no JSX.</p>
			</section>
		</main>
	`,
});
