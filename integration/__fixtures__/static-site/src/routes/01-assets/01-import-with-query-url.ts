import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../documents/document-with-assets.js';

import customStylesheet from './_00-import-with-query-url--server-2.scss?url';
import './01-import-with-query-url.my-el.js';

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<h1>Hello world</h1>
		<hr />
		<code>${context.url.pathname}</code>

		<!-- FIXME: Why it's putting /@fs/ and not /src/ ? -->
		<my-el extra-styles=${[customStylesheet].toString()}></my-el>
	`,
});
