import '../features/my-greetings.jsx';

import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile JSX - Home' }),

	template: (context) => html`
		<h1>Hello Gracile — JSX Forge</h1>

		<h2>${context.url}</h2>

		<dl>
			<dt>Gracile</dt>
			<dd>
				<a href="https://gracile.js.org" target="_blank">Documentation</a>
			</dd>

			<dt>Custom Element (JSX → Lit)</dt>
			<dd><my-greetings></my-greetings></dd>

			<dt>Dummy page</dt>
			<dd><a href="/about/">About page</a></dd>
		</dl>
	`,
});
