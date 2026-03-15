import { isServer } from 'lit';
import { defineRoute } from '@gracile/server/route';
import picomatch from 'picomatch';

import { NavMain } from '../../features/nav-main.jsx';
import { FooterMain } from '../../features/footer-main.jsx';
import {
	BreadCrumbs,
	type BreadCrumbsList,
} from '../../features/breadcrumbs.jsx';
import { NavRight } from '../../features/nav-right.jsx';
import { document } from '../../document/document.jsx';
import { LinksPagination } from '../../features/links-pagination.jsx';
import { LinksIndex } from '../../features/links-index.jsx';
import { router } from '../../lib/router.js';

export default defineRoute({
	staticPaths: async () => {
		const { docsContentImportsGlob, docsMetaImports, markdownTree } =
			await import('../../content/content.js');

		return Promise.all(
			docsMetaImports.map(async ({ pathParams, module /* href */ }, index) => ({
				params: {
					path: pathParams,
				},
				props: {
					markdownTree,

					current: module,
					content: await docsContentImportsGlob[module.path]?.().then(
						(m) => m.content,
					),

					prev:
						module.path.endsWith('/README.md') ||
						docsMetaImports[index - 1]?.module?.path?.endsWith('/README.md')
							? null
							: docsMetaImports[index - 1] || null,

					next:
						module.path.endsWith('/README.md') ||
						docsMetaImports[index + 1]?.module?.path?.endsWith('/README.md')
							? null
							: docsMetaImports[index + 1] || null,

					index: docsMetaImports
						.filter((m) => {
							if (module.path.endsWith('/README.md') === false) return false;

							if (m.module.path === module.path) return false;

							const base = module.path.split('/').slice(0, -1).join('/');
							const siblings = base + '/*.md';
							const subReadmes = base + '/*/README.md';

							const tested = m.module.path;

							const match = picomatch([siblings, subReadmes]);
							return match(tested);
						})
						.sort((p, n) =>
							p.module.path.replace('README.md', '') >
							n.module.path.replace('README.md', '')
								? 1
								: -1,
						),

					breadCrumbs: [
						//
						{ url: '/docs/', title: 'Docs' },
						...(pathParams
							? pathParams
									.split('/')
									.slice(0, -1)
									.map((_d, index_) => {
										const m = docsMetaImports.find((m) => {
											return (
												m.pathParams ===
												pathParams
													?.split('/')
													.slice(0, index_ + 1)
													.join('/')
											);
										});
										if (!m) throw new Error('Missing breadcrumb item!');

										return { url: m.href, title: m.module.title };
									})
							: []),
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
			breadcrumbs: context.props.breadCrumbs.map((crumb) => ({
				name: crumb.title,
				href: crumb.url,
			})),
		}),

	template: ({ url, props }) => {
		// console.log({ markdownTree });
		return (
			<>
				<NavMain
					name={'docs'}
					pathname={url.pathname}
					tree={props.markdownTree}
				/>
				<main class="content">
					<BreadCrumbs breadCrumbs={props.breadCrumbs} />

					<article
						class="prose"
						data-toc-content
						unsafe:html={props.content || 'No content for this page!'}
					></article>

					{props.prev || props.next ? (
						<LinksPagination prev={props.prev} next={props.next} />
					) : null}

					{Object.entries(props.index).length > 0 ? (
						<LinksIndex index={props.index} />
					) : null}
				</main>
				<NavRight markdownModule={props.current} />
				<FooterMain url={url} filename={props.current.path} />
			</>
		);
	},
});

// NOTE: Disabled, randomly broke and too much maintenance/bundle size cost.
// Maybe use the embeddable iframe instead?
async function loadAsciinema() {
	// if (
	//   globalThis.document.location.pathname ===
	//   '/docs/learn/getting-started/installation/'
	// ) {
	//   await import('../../lib/asciinema-player/asciinema-player.js');
	//   await import('../../components/asciinema-player-header.js');
	// }
}

if (!isServer) {
	requestIdleCallback(() => {
		void import('../../lib/toc-links-follower.js');
		// @ts-expect-error no typings
		void import('caniuse-embed-element/dist/caniuse-embed-element.js');
	});

	await loadAsciinema();
	router.addEventListener('route-rendered', loadAsciinema);
}
