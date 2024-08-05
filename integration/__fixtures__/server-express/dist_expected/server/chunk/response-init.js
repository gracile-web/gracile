import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { d as document } from './document.js';
import '@gracile/gracile/document';

const responseInit = defineRoute({
  handler: {
    GET({ responseInit, request }) {
      responseInit.headers = { bar: "baz", daz: "doze" };
      responseInit.status = 210;
      responseInit.statusText = "Hi there" + request.headers.get("hey");
    },
    POST({ responseInit, request }) {
      responseInit.headers = { azz: "ozz", dizz: "duzz" };
      responseInit.status = 211;
      responseInit.statusText = "Ola" + request.headers.get("hey");
    }
  },
  document: (context) => document({ ...context, title: "Gracile About" }),
  template: () => html`
		<!--  -->
		<h1>the About Page</h1>

		<!--  -->
	`
});

export { responseInit as default };
