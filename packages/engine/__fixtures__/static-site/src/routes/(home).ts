import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';
import { document } from '../documents/document-minimal.js';

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<!--  -->

		<h1>Home !!</h1>
	`,
});
