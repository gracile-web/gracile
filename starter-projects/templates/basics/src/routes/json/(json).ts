import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { DEV_URL } from '../../constants.js';
import { document } from '../../document.js';

export default defineRoute({
	document: (context) =>
		document({ ...context, title: 'JSON endpoint with routing' }),

	template: () => html`
		<main class="shell-content-centered">
			<p>
				Make some fetch calls to
				<code>${DEV_URL}json/api/simple/pet/${'<NUMBER>'}/</code>!
			</p>

			<hr />

			<simple-api-fetcher>
				<button id="pet">Get a Pet (1)</button>
				<button id="no-pet">No pet found (10)</button>
				<button id="wrong-method">Wrong method (DELETE)</button>

				<hr />

				<pre>Dump…</pre>
			</simple-api-fetcher>
		</main>
	`,
});
