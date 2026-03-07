import '../../features/my-greetings-tailwind.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { tailwindDemoContent } from '../../content/tailwind-demo.js';
import { document } from '../../document.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile - Tailwind' }),

	template: () => html`
		<h1 class="my-4 text-6xl font-bold">Tailwind Demo</h1>

		<section>
			<h2 class="my-4 text-2xl font-bold">Inside light DOM</h2>

			<div>
				<span class="text-3xl font-bold underline">Hello world!</span>
			</div>
		</section>

		<section>
			<h2 class="my-4 text-2xl font-bold">Inside Custom Element shadow root</h2>

			<div>
				<my-greetings-tailwind></my-greetings-tailwind>
				<my-greetings-tailwind></my-greetings-tailwind>
				<my-greetings-tailwind></my-greetings-tailwind>
				<my-greetings-tailwind></my-greetings-tailwind>
			</div>
		</section>

		<section>
			<h2 class="my-4 text-2xl font-bold">Typography in Shadow DOM</h2>

			<div>
				<template shadowrootmode="open">
					<adopt-global-styles></adopt-global-styles>

					<div>${tailwindDemoContent()}</div>
				</template>
			</div>
		</section>

		<section>
			<h2 class="my-4 text-2xl font-bold">Typography in Light DOM</h2>

			<div>${tailwindDemoContent()}</div>
		</section>
	`,
});
