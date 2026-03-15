import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Streams' }),

	template: () => html`
		<main class="shell-content-centered">
			<p>Let the stream flow!</p>

			<hr />

			<simple-event-sourcer>
				<pre>
Dump…
---------------------------------------------------------
</pre
				>
			</simple-event-sourcer>
		</main>
	`,
});
