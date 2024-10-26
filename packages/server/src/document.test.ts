/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { isLitServerTemplate } from '@gracile/internal-utils/assertions';
import { html } from 'lit';

import * as document from './document.js';

describe('should exports helpers', () => {
	test('pageAssets', () => {
		assert.equal(
			isLitServerTemplate(document.pageAssetsCustomLocation()),
			true,
		);
	});

	test('RouteTemplateOutlet render', () => {
		assert.notStrictEqual(
			new document.RouteTemplateOutlet().render(),
			html`Something went wrong during server side rendering!`,
		);
	});
	test('RouteTemplateOutlet types', () => {
		/* Types Tests */
		new document.RouteTemplateOutlet() satisfies HTMLElementTagNameMap['route-template-outlet'];
	});
});
