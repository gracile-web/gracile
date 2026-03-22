import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	prerender: true,

	document: (context) => document({ ...context, title: 'Demo - About' }),

	template: () => html`
		<h1>About</h1>

		<p>
			This is a <strong>prerendered</strong> route. It is rendered to a static
			HTML file at build time, producing the same kind of artifact as a fully
			static site.
		</p>

		<p>
			Look at <code>dist/client/about/index.html</code> after building — the
			HTML template literals in the source were minified by the plugin before
			Gracile rendered the page.
		</p>

		<section>
			<h2>How it works</h2>

			<dl>
				<dt>HTML templates (<code>html\`…\`</code>)</dt>
				<dd>
					Minified by
					<a href="https://www.npmjs.com/package/html-minifier-next"
						>html-minifier-next</a
					>: whitespace collapsed, comments removed, attributes optimized.
				</dd>

				<dt>CSS templates (<code>css\`…\`</code>)</dt>
				<dd>
					Static templates (no interpolations) are minified by
					<a href="https://www.npmjs.com/package/lightningcss">lightningcss</a>.
					Templates with <code>\${…}</code> expressions are left untouched.
				</dd>
			</dl>
		</section>

		<nav>
			<a href="/">&larr; Home (server-rendered)</a>
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
