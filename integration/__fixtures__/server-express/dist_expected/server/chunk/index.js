import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { d as document } from './document.js';
import '@gracile/gracile/document';

const index = defineRoute({
  document: (context) => document({ ...context, title: "Gracile Private" }),
  template: () => html`
		<!--  -->
		<h1>Private!</h1>

		<!--  -->
	`
});

export { index as default };
