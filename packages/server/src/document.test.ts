/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { isLitServerTemplate } from '@gracile/engine/assertions';
import { html } from 'lit';

import { helpers, RouteTemplateOutlet } from './document.js';

describe('should exports lit template', () => {
	test('assert lit', () => {
		assert.equal(isLitServerTemplate(helpers.dev.errors), true);
		assert.equal(isLitServerTemplate(helpers.fullHydration), true);
		assert.equal(isLitServerTemplate(helpers.pageAssets), true);
		assert.equal(
			isLitServerTemplate(helpers.polyfills.declarativeShadowDom),
			true,
		);
		assert.equal(
			isLitServerTemplate(helpers.polyfills.requestIdleCallback),
			true,
		);

		assert.notStrictEqual(
			new RouteTemplateOutlet().render(),
			html`Something went wrong during server side rendering!`,
		);

		/* Types Tests */
		new RouteTemplateOutlet() satisfies HTMLElementTagNameMap['route-template-outlet'];
	});
});
