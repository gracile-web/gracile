import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { blogPosts } from '../../content/content.js';
import { document } from '../../document.js';
import { tree } from '../../features/tree.js';

export default defineRoute({
	staticPaths: () =>
		Object.values(blogPosts).map((module) => ({
			params: { slug: module.meta.slug },
			props: {
				title: module.meta.title,
				content: module.body.lit,
				toc: module.meta.tableOfContents,
				module,
			},
		})),

	document: (context) => document({ ...context, title: null }),

	template: (context) => html`
		<main class="blog-post">
			<header>
				<h1>${context.props.title}</h1>
			</header>

			<hr />

			<div>
				<article class="prose">${context.props.content}</article>

				<aside class="table-of-contents">
					<span>Jump to:</span>
					<!--  -->
					${tree({ tree: context.props.toc[0]?.children })}
				</aside>
			</div>

			<footer>
				<a class="back-to-blog" href="..">👈 Back to the Blog</a>
			</footer>
		</main>
	`,
});
