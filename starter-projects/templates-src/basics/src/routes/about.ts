import '../features/counters/my-lit-counter.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import aboutText from '../content/about.md';
import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'About' }),

	template: () => html`
		<!--  -->
		<section class="prose">
			<header>
				<blockquote>
					👉 Edit the <strong>Markdown</strong> file below in
					<code>src/content/about.md</code>
				</blockquote>
			</header>

			<article>${aboutText.body.lit}</article>

			<footer>
				<p>
					Published on:
					<strong
						>${new Date(
							aboutText.meta.frontmatter.publication_date as string,
						).toDateString()}</strong
					>
					by <strong>${aboutText.meta.frontmatter.author}</strong>.
				</p>
			</footer>
		</section>
	`,
});
