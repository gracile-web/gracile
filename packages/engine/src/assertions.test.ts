/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { html as serverHtml } from '@lit-labs/ssr';
import { html } from 'lit';

import {
	isLitNormalTemplate,
	isLitServerTemplate,
	isLitTemplate,
	isUnknownObject,
} from './assertions.js';

describe('should assert lit templates', () => {
	test('assert lit', () => {
		const lit = html` <div>Hello</div> `;
		const litServer = serverHtml` <div>Hello</div> `;

		assert.equal(isLitTemplate(lit), true);
		assert.equal(isLitTemplate(litServer), true);

		assert.equal(isLitNormalTemplate(lit), true);
		assert.equal(isLitServerTemplate(litServer), true);

		assert.equal(isUnknownObject({ something: 'something' } as never), true);

		//

		assert.equal(isLitTemplate([]), false);
		assert.equal(isLitTemplate([]), false);

		assert.equal(isLitNormalTemplate([]), false);
		assert.equal(isLitServerTemplate([]), false);
	});
});
