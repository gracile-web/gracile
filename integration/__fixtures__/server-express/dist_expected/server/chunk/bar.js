import { d as defineRoute, a as document } from './document.js';
import { html } from '@lit-labs/ssr/lib/server-template.js';
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
//# sourceMappingURL=bar.js.map
