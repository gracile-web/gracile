import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';
import { document } from '../../../documents/document-minimal.js';

const LINKS = [
	{ href: '', path: '(movie-index).ts' },
	{ href: '/shoot-or/', path: 'shoot-or.ts' },
	// { href: '/unresolved-art/', path: '[arrow]-noon.ts' },

	{ href: '/year-noon/', path: '[besides]-noon.ts' },
	{ href: '/dance-noon/', path: '[arrow]-noon.ts' },

	{ href: '/edge-noon-plumber/', path: '[arrow]-noon-[dive].ts' },

	{ href: '/creation-noon/', path: '[arrow]-noon.ts' },
	{ href: '/popular/', path: '[trustee]/index.ts' },

	{ href: '/popular/research/', path: '[trustee]/research.ts' },
	{ href: '/formal/research/', path: '[trustee]/research.ts' },

	{ href: '/formal/guide/', path: '[trustee]/[...verdict].ts' },
	{ href: '/popular/yearn/', path: '[trustee]/[...verdict].ts' },
	{ href: '/popular/brave/', path: '[trustee]/[...verdict].ts' },

	{
		href: '/car/bike/boat/zeppelin/',
		path: '/car/bike/boat/zeppelin.ts',
	},

	{ href: '/make/best/', path: 'make/[advance].ts' },
	{ href: '/make/done/', path: 'make/[vast].ts' },
];

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<h1>movie (index)</h1>

		<hr />
		<code>${context.url.pathname}</code>

		<ul>
			${LINKS.map((link) => {
				return html`
					<li>
						<a href=${`.${link.href}`}>
							${'>'} <code>${link.href}</code>
							<br />
							<code>${link.path}</code>
						</a>
					</li>
				`;
			})}
		</ul>

		<style>
			body {
				font-size: 18px;
				line-height: 2;
			}

			li {
				display: block;
				margin-bottom: 1rem;
			}

			a {
				text-decoration: none;
				display: inline-block;
				&:hover {
					color: white;
				}
			}
		</style>
	`,
});
