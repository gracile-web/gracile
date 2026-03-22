import '../../features/my-greetings-bootstrap.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile - Bootstrap' }),

	template: () => html`
		<h1 class="">Bootstrap Demo</h1>

		<section>
			<h2 class="">Inside light DOM</h2>

			<div>
				<h1>Example heading <span class="badge bg-secondary">New</span></h1>
				<h2>Example heading <span class="badge bg-secondary">New</span></h2>
				<h3>Example heading <span class="badge bg-secondary">New</span></h3>
				<h4>Example heading <span class="badge bg-secondary">New</span></h4>
				<h5>Example heading <span class="badge bg-secondary">New</span></h5>
				<h6>Example heading <span class="badge bg-secondary">New</span></h6>
			</div>
		</section>

		<section>
			<h2 class="">Inside Custom Element shadow root</h2>

			<div>
				<my-greetings-bootstrap></my-greetings-bootstrap>
			</div>
		</section>
	`,
});
