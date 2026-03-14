import { defineRoute } from '@gracile/server/route';

import { NavMain } from '../../features/nav-main.jsx';

import {
	BreadCrumbs,
	type BreadCrumbsList,
} from '../../features/breadcrumbs.jsx';
import { NavRight } from '../../features/nav-right.jsx';
import { document } from '../../document/document.jsx';

import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';
import { FooterMain } from '../../features/footer-main.jsx';
import { LinksPagination } from '../../features/links-pagination.jsx';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const tree = {
	docs: {
		directory: {
			blog: {
				directory: {
					'README.md': {
						metadata: {
							titleHtml: 'Blog',
							href: '/blog/',
						},
					},
					abc: {
						directory: {},
					},
				},
			},

			doc: {
				metadata: {
					href: '/docs/',
					titleHtml: 'Documentation',
				},
			},
		},
	},
};

export default defineRoute({
	staticPaths: async () => {
		const { blogContentImportsGlob, blogMetaImports /* markdownTree */ } =
			await import('../../content/content.js');
		return Promise.all(
			blogMetaImports.map(async ({ pathParams, module /* href */ }, index) => ({
				params: { path: pathParams },
				props: {
					blogMetaImports,

					current: module,
					content: await blogContentImportsGlob[module.path]?.().then(
						(m) => m.content,
					),

					prev: blogMetaImports[index - 1] || null,

					next: blogMetaImports[index + 1] || null,

					breadCrumbs: [
						{ url: '/blog/', title: 'Blog' },
					] satisfies BreadCrumbsList,
				},
			})),
		);
	},

	document: (context) =>
		document({
			url: context.url,
			title: context.props.current.title,
			description: context.props.current.excerpt,
			layout: 'blog',
			breadcrumbs: context.props.breadCrumbs.map((crumb) => ({
				name: crumb.title,
				href: crumb.url,
			})),
		}),

	template: async ({ url, props, params }) => (
		<>
			<NavMain name={'blog'} pathname={url.pathname} tree={tree} />

			<main class="content">
				<BreadCrumbs breadCrumbs={props.breadCrumbs} />

				{params.path ? (
					<article class="prose" data-toc-content>
						<header class="blog-header">
							{params.path && props.current.frontmatter.publishedAt ? (
								<>
									Published on{' '}
									{new Date(
										props.current.frontmatter.publishedAt,
									).toLocaleDateString(undefined, { dateStyle: 'full' })}{' '}
									- by {props.current.frontmatter.author ?? 'Julian Cataldo'}
								</>
							) : null}

							{props.current.frontmatter.updatedAt ? (
								<>
									<br />
									<small>
										Updated on
										{new Date(
											props.current.frontmatter.updatedAt,
										).toLocaleDateString(undefined, { dateStyle: 'full' })}
									</small>
								</>
							) : null}
						</header>

						{params.path ? (
							<>{unsafeHTML(props.content || 'No content for this page!')}</>
						) : null}
					</article>
				) : (
					<>
						<h1 unsafe:html={props.current.titleHtml} />
						{props.current.excerpt}

						<hr />

						<For
							each={Object.values(
								props.blogMetaImports.filter((p) => p.pathParams),
							)}
						>
							{(post) => (
								<ul for:key={post.href}>
									<li>
										<a href={post.href} unsafe:html={post.module.titleHtml} />
									</li>
								</ul>
							)}
						</For>
					</>
				)}

				{(params.path && props.prev) || props.next ? (
					<LinksPagination prev={props.prev} next={props.next} />
				) : null}
			</main>

			<NavRight markdownModule={props.current} />

			<FooterMain url={url} filename={props.current.path} />
		</>
	),
});
