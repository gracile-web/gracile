import './_lit-element.js';

import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from './_document-with-lit-hydration.js';

export default defineRoute({
	document: (context) => document(context),

	template: () => html`
		<!--  -->
		<lit-element></lit-element>
	`,
});
