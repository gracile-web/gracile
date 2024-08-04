import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { d as document } from './document.js';
import '@gracile/gracile/document';

const _404 = defineRoute({
  document: (context) => document({ ...context, title: "Gracile - 404" }),
  template: (context) => html`
		<h1>⚠️ 404 !!</h1>

		<p><code>${context.url.toString()}</code> not found.</p>
	`
});

export { _404 as default };
