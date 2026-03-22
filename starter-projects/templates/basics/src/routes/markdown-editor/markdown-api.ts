import '../../features/counters/my-lit-counter.js';

import { defineRoute } from '@gracile/gracile/route';
import { MarkdownRenderer } from '@gracile/markdown-preset-marked/renderer';
import { html } from 'lit';

const render = new MarkdownRenderer();

export default defineRoute({
	handler: {
		POST: async (context) =>
			render.init({ source: await context.request.text() }),
	},

	template: () => html`
		<article>${render.lit}</article>

		<hr />

		<footer>Generated on ${new Date()}</footer>
	`,
});
