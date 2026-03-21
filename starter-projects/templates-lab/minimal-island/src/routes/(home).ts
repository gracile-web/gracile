import '../features/my-greetings.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile - Islands' }),

	template: (context) => html`
		<h1><img src="/favicon.svg" height="25" /> - Hello Gracile Islands</h1>

		<h2>${context.url}</h2>

		<dl>
			<dt>Gracile</dt>
			<dd>
				<a href="https://gracile.js.org" target="_blank">Documentation</a>
			</dd>

			<dt>Custom Element (Lit)</dt>
			<dd><my-greetings></my-greetings></dd>

			<dt>React Island</dt>
			<dd>
				<is-land load="CounterReact">
					<p>Loading React counter…</p>
				</is-land>
			</dd>

			<dt>Vue Island</dt>
			<dd>
				<is-land load="CounterVue">
					<p>Loading Vue counter…</p>
				</is-land>
			</dd>

			<dt>Dummy page</dt>
			<dd><a href="/about/">About page</a></dd>
		</dl>
	`,
});
