import { d as defineRoute } from './route.js';
import { html } from '@lit-labs/ssr/lib/server-template.js';
import { d as document } from './document.js';
import '../server.js';
import 'node:stream';
import 'tty';
import '@lit-labs/ssr';
import '@lit-labs/ssr/lib/render-result.js';
import 'stream';
import 'fs';
import 'url';
import 'http';
import 'util';
import 'https';
import 'zlib';
import 'buffer';
import 'crypto';
import 'querystring';
import 'stream/web';
import 'express';
import 'path';
import 'lit';
import 'lit/directives/unsafe-html.js';

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
//# sourceMappingURL=(home).js.map
