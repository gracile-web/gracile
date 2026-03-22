import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
	document: (context) =>
		document({ ...context, title: 'Standard CSS Modules — Demo' }),

	template: (context) => html`
		<h1>Standard CSS Modules — Gracile Demo</h1>

		<h2>${context.url}</h2>

		<dl>
			<dt>Plugin</dt>
			<dd>
				<code>vite-plugin-standard-css-modules</code>
			</dd>

			<dt>Custom Element (with CSS import attributes)</dt>
			<dd>
				<my-counter>
					<p>
						This component uses
						<code
							>import styles from './my-counter.css' with { type: 'css' }</code
						>
					</p>
				</my-counter>
			</dd>
		</dl>
	`,
});
