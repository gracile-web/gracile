import './(editor).client.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../../document.js';

const initial = `# Initial content

**Hey there**, _this is some markdown_.

## Try me!

> You can type something here, and the result will refresh in real time.

## Finding Beauty in the Mundane

In the realm of exercises in \`futility\`,
even the most mundane tasks take on a transcendent quality.
Whether it's watching clouds drift lazily across the sky or
meticulously arranging grains of sand on a beach
these seemingly insignificant actions become **portals** to a world of
wonder and awe, reminding us of the beauty that exists in the everyday.

## Custom Elements

This one is server rendered and hydrated!

<my-lit-counter count="2">Lit counter</my-lit-counter>

---

<my-vanilla-counter count="2">Vanilla Counter</my-vanilla-counter>

---

© ${new Date().getFullYear()} — ACME, inc.
`;

export default defineRoute({
	document: (context) => document({ ...context, title: 'Markdown editor' }),

	template: () => html`
		<main>
			<header style="text-align: center">
				<p>Start to type and see what happens!</p>
				<p>
					Markdown is rendered on the server and fetched back on the client.
				</p>
			</header>

			<markdown-editor initial=${initial}></markdown-editor>
		</main>
	`,
});
