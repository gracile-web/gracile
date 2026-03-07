import '../features/my-greetings.js';
import '../features/my-big-content.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile - Home' }),

	template: (context) => html`
		<h1><img src="/favicon.svg" height="25" /> - Hello Gracile</h1>

		<h2>${context.url}</h2>

		<dl>
			<dt>Gracile</dt>
			<dd>
				<a href="https://gracile.js.org" target="_blank">Documentation</a>
			</dd>

			<dt>Prerendered page</dt>
			<dd><a href="/about/">About page</a></dd>

			<dt>Custom Element</dt>
			<dd><my-greetings></my-greetings></dd>
		</dl>

		<hr />

		<div>
			<h2>Demo Isomorphic Minification - Custom Element</h2>
			<p>DSD + Client + Hydration</p>

			<hr />

			<div>
				<!--  -->
				<my-big-content .someProperty=${'Ola binding!'}></my-big-content>
			</div>
		</div>
	`,
});
