/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { isLitServerTemplate } from '@gracile/internal-utils/assertions';
import { html } from 'lit';

import * as doc from './document.js';

describe('should exports helpers', () => {
	test('pageAssets', () => {
		assert.equal(isLitServerTemplate(doc.pageAssetsCustomLocation()), true);
	});

	test('RouteTemplateOutlet render', () => {
		assert.notStrictEqual(
			new doc.RouteTemplateOutlet().render(),
			html`Something went wrong during server side rendering!`,
		);
	});
	test('RouteTemplateOutlet types', () => {
		/* Types Tests */
		new doc.RouteTemplateOutlet() satisfies HTMLElementTagNameMap['route-template-outlet'];
	});
});
