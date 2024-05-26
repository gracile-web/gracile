import { d as defineRoute, a as document } from './document.js';
import { html } from '@lit-labs/ssr/lib/server-template.js';
import '../server.js';
import 'express';
import 'node:stream';
import 'tty';
import '@lit-labs/ssr';
import '@lit-labs/ssr/lib/render-result.js';
import 'stream';
import 'fast-glob';
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
import 'path';
import 'lit';
import 'lit/directives/unsafe-html.js';

const _test_ = defineRoute({
  handler: {
    GET: () => {
      console.log("Hey");
      return {};
    }
  },
  document: (context) => document({ ...context, title: "Gracile Test" }),
  template: () => html`
		<!--  -->
		<h1>Hello Gracile - Test page</h1>

		<!--  -->
	`
});

export { _test_ as default };
//# sourceMappingURL=_test_.js.map
