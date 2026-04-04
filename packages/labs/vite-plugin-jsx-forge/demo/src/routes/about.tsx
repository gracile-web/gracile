import { defineRoute } from '@gracile/gracile/route';

import { document } from '../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile JSX - About' }),

	template: () => (
		<>
			<h1>About</h1>
			<article>
				This demo uses <code>vite-plugin-jsx-forge</code> to transform JSX in
				<code>.tsx</code> files into Lit tagged template literals.
			</article>
		</>
	),
});
