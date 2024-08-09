import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { d as document } from './document.js';

const contact = defineRoute({
  // TODO:
  prerender: true,
  document: (context) => document({ ...context, title: "Gracile Contact" }),
  template: () => html`
		<!--  -->
		<h1>the Contact Page</h1>

		<!--  -->
	`
});

export { contact as default };
