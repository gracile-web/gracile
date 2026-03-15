import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../documents/document-islands.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'All Islands' }),

	template: (context) => html`
		<h1>Hello Islands</h1>

		<code>${context.url.pathname}</code>

		<section id="react-island">
			<h2>React</h2>
			<is-land load="CounterReact">
				<p>Fallback: React loading…</p>
			</is-land>
		</section>

		<section id="vue-island">
			<h2>Vue</h2>
			<is-land load="CounterVue">
				<p>Fallback: Vue loading…</p>
			</is-land>
		</section>

		<section id="svelte-island">
			<h2>Svelte</h2>
			<is-land load="CounterSvelte">
				<p>Fallback: Svelte loading…</p>
			</is-land>
		</section>

		<section id="solid-island">
			<h2>Solid</h2>
			<is-land load="CounterSolid">
				<p>Fallback: Solid loading…</p>
			</is-land>
		</section>

		<section id="preact-island">
			<h2>Preact</h2>
			<is-land load="CounterPreact">
				<p>Fallback: Preact loading…</p>
			</is-land>
		</section>
	`,
});
