import '../features/status-card.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	handler: {
		GET: ({ url, locals }) => {
			return {
				...locals,
				query: url.searchParams.get('filter') || '(none)',
			};
		},
	},

	document: (context) => document({ ...context, title: 'Demo - Home' }),

	template: (context) => html`
		<h1>@literals/rollup-plugin-html-css-minifier</h1>

		<p>
			This is a <strong>server-rendered</strong> route. The HTML and CSS
			template literals in this page's source code are minified at build time by
			the Vite/Rollup plugin.
		</p>

		<p>
			Check <code>dist/server/</code> and <code>dist/client/</code> after
			building to see the minified output.
		</p>

		<h2>Server context</h2>

		<status-card
			label="Request ID"
			value=${context.props.GET.requestId}
		></status-card>

		<status-card
			label="User email"
			value=${context.props.GET.userEmail ?? 'unknown'}
		></status-card>

		<status-card
			label="Query (?filter)"
			value=${context.props.GET.query}
		></status-card>

		<nav>
			<a href="/about/">About (prerendered) &rarr;</a>
		</nav>

		<style>
			.some-class {
				color: red;
				padding: 0.5rem;
			}
		</style>

		<script>
			{
				const myVar1 = 1;
				const myVar2 = 2;
				console.log('This script is minified by the plugin as well!', myVar1);
			}
		</script>
	`,
});
