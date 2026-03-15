'use html-signal';
import { defineRoute } from '@gracile/gracile/route';

import { document } from '../document.jsx';
import ddd from '../document.jsx?raw';
// import '../features/title-element.element.js';

console.log({ ddd });

export default defineRoute({
	document: () => document({ title: 'Gracile - TodoMVC' }),

	template: () => (
		<main>
			<wa-checkbox>Checkbox</wa-checkbox>
			HELLP
			<pre>
				<code>{ddd}</code>
			</pre>
		</main>
	),
});
