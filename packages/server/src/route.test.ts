/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert';
import test, { describe } from 'node:test';

import { RouteModule } from '@gracile/engine/routes/route';
import { html as serverHtml } from '@lit-labs/ssr';
import { html } from 'lit';

import { defineRoute } from './route.js';

const DUMMY_CONTEXT = {
	params: {},
	props: {},
	url: new URL(import.meta.url),
};

describe('routes configurations', () => {
	test('route with document and template', () => {
		const staticRoute = defineRoute({
			staticPaths: () => {
				return [{ params: { foo: 'bar' }, props: { baz: 'daz' } }];
			},

			document: (context) =>
				serverHtml`<nothing-to-see>${context.params.foo}${context.props.baz}${context.url.toString()}</nothing-to-see>`,
			template: (context) =>
				// prettier-ignore
				html`<div>Hey ${123}${context.params.foo}${context.props.baz}${context.url.toString()}</div>`,

			prerender: true,
		})(RouteModule);

		assert.deepEqual(
			staticRoute.template?.(DUMMY_CONTEXT),
			// prettier-ignore
			html`<div>Hey ${123}${undefined}${undefined}${import.meta.url.toString()}</div>`,
		);
		assert.deepEqual(
			staticRoute.document?.(DUMMY_CONTEXT),
			serverHtml`<nothing-to-see>${undefined}${undefined}${import.meta.url.toString()}</nothing-to-see>`,
		);
		assert.deepEqual(staticRoute.staticPaths?.(), [
			{ params: { foo: 'bar' }, props: { baz: 'daz' } },
		]);

		assert.deepEqual(staticRoute.prerender, true);

		// ---

		const dynamicRoute = defineRoute({
			handler: {
				GET() {
					return { hello: 'world' };
				},
			},

			document: (context) =>
				serverHtml`<nothing-to-see>${context.props.GET.hello}</nothing-to-see>`,
			template: (context) =>
				html`<div>Hey ${123} - ${context.props.GET.hello}</div>`,
		})(RouteModule);

		if (typeof dynamicRoute.handler !== 'function') {
			assert.deepEqual(dynamicRoute.handler?.GET?.name, 'GET');
		}
	});

	// TODO: Test failing types, e.g, cannot have staticPaths and handler together
});
