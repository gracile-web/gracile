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

const index = defineRoute({
  document: (context) => document({ ...context, title: "Gracile Private" }),
  template: () => html`
		<!--  -->
		<h1>Private!</h1>

		<!--  -->
	`
});

export { index as default };
//# sourceMappingURL=index.js.map
