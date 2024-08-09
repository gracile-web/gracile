import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile - Oh no' }),

	template: (context) => html`
		<h1>⚠️ Arrrrrhh !!</h1>

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
