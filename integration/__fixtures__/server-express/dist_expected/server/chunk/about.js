import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { d as document } from './document.js';

const about = defineRoute({
  prerender: true,
  document: (context) => document({ ...context, title: "Gracile About" }),
  template: () => html`
		<!--  -->
		<h1>the About Page</h1>

		<!--  -->
	`
});

export { about as default };
