import '../features/my-greetings.js';

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';
import { topMenu } from '../features/top-menu.js';

export default defineRoute({
	document: (context) => document({ ...context, title: 'Gracile - Home' }),

	template: (context) => html`
		${topMenu()}

		<h1><img src="/favicon.svg" height="25" /> - Hello Gracile</h1>

		<h2>${context.url}</h2>

		<dl>
			<dt>Gracile</dt>
			<dd>
				<a href="https://gracile.js.org" target="_blank">Documentation</a>
			</dd>

			<dt>Custom Element</dt>
			<dd><my-greetings></my-greetings></dd>
		</dl>
	`,
});
