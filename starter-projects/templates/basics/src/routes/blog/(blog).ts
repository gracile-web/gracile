import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { blogPosts, getBlogPostHref } from '../../content/content.js';
import { document } from '../../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Blog' }),

	template: () => html`
		<main class="blog-index">
			<header>
				<blockquote>👋 <em>Welcome to my blog!</em></blockquote>
			</header>

			<hr />

			<!--  -->
			<ul>
				${Object.entries(blogPosts).map(([path, module]) => {
					return html`
						<li>
							<a href=${getBlogPostHref(path)}>
								<h2>${module.meta?.title}</h2>
								<p class="article-description">${module.excerpt.text}</p>
							</a>
						</li>
					`;
				})}
			</ul>
		</main>
	`,
});
