import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { d as document } from './document.js';
import '@gracile/gracile/document';

const _home_ = defineRoute({
  handler: {
    GET: ({ url }) => {
      return { query: url.searchParams.get("q") };
    }
  },
  document: (context) => document({ ...context, title: "Gracile Home" }),
  template: (context) => html`
		<!--  -->
		<h1><img src="/favicon.svg" height="25" /> - Hello Gracile (Home)</h1>

		<ul>
			<li><a href="/api">JSON API</a></li>
		</ul>

		<div>QUERY: <code>${context.props.GET.query}</code></div>
		<!--  -->

		<code>${new URL("./(home).css", import.meta.url)}</code>
		<!--  -->
	`
});

export { _home_ as default };
