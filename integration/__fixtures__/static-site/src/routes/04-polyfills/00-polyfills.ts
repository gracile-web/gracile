import { defineRoute } from '@gracile/server/route';
import { html } from 'lit';

import { document } from './_document-with-polyfills.js';

export default defineRoute({
	document: (context) => document(context),

	template: (context) => html`
		<h1>Hello Polyfills</h1>
		<hr />
		<code>${context.url.pathname}</code>

		<div>
			<template shadowrootmode="open">
				<!--  -->
				Hello shadow
			</template>
		</div>
	`,
});
