import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../documents/document-with-assets.js';

import './_02-import-with-query-css-inline.my-el.js';

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<h1>Hello world</h1>
		<hr />
		<code>${context.url.pathname}</code>

		<!-- FIXME: Why it's putting /@fs/ and not /src/ ? -->

		<my-el-with-inline-css></my-el-with-inline-css>
	`,
});
