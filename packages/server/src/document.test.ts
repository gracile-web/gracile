/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { isLitServerTemplate } from '@gracile/engine/assertions';
import { html } from 'lit';

import { helpers, RouteTemplateOutlet } from './document.js';

describe('should exports helpers', () => {
	test('helpers errors', () => {
		assert.equal(isLitServerTemplate(helpers.dev.errors), true);
	});
	test('hydration', () => {
		assert.equal(isLitServerTemplate(helpers.fullHydration), true);
	});
	test('pageAssets', () => {
		assert.equal(isLitServerTemplate(helpers.pageAssets), true);
	});
	test('dsd', () => {
		assert.equal(
			isLitServerTemplate(helpers.polyfills.declarativeShadowDom),
			true,
		);
	});
	test('requestIdleCallback', () => {
		assert.equal(
			isLitServerTemplate(helpers.polyfills.requestIdleCallback),
			true,
		);
	});
	test('RouteTemplateOutlet render', () => {
		assert.notStrictEqual(
			new RouteTemplateOutlet().render(),
			html`Something went wrong during server side rendering!`,
		);
	});
	test('RouteTemplateOutlet types', () => {
		/* Types Tests */
		new RouteTemplateOutlet() satisfies HTMLElementTagNameMap['route-template-outlet'];
	});
});
