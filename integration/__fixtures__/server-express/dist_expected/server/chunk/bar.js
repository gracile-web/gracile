import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { d as document } from './document.js';

const bar = defineRoute({
  document: (context) => document({ ...context, title: "Gracile Foo/Bar" }),
  template: () => html`
		<!--  -->
		<h1><img src="/favicon.svg" height="25" /> - Hello Gracile (foo/bar)</h1>

		<ul>
			<li><a href="/api">JSON API</a></li>
		</ul>

		<!--  -->
	`
});

export { bar as default };
