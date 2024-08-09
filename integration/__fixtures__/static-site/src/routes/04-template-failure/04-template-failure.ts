import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from '../../documents/document-minimal.ts';

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<h1>Hello Polyfills</h1>
		<hr />
		<code>${context.url.pathname}</code>

		<div>FAILING-1</div>
		<div>FAILING-2</div>
		<!-- ${() => {}} -->
		<div>FAILING-3</div>
		<div>FAILING-4</div>
		<!-- <div>${() => {
			'FAILING-5';
		}}</div> -->
		<div>FAILING-6</div>
		<div>FAILING-7</div>
		<!-- ${() => {}} -->
		<div>FAILING-8</div>
		<div>FAILING-9</div>
	`,
});
