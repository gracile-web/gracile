/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { noop } from '@gracile/internal-test-utils/noop';

describe('babel-plugin-jsx-to-literals package should export correctly', () => {
	test('main export', async () => {
		const mod = await import('@gracile-labs/babel-plugin-jsx-to-literals');

		assert.equal(typeof mod.default, 'function');

		noop(mod);
	});

	test('components', async () => {
		const forComp =
			await import('@gracile-labs/babel-plugin-jsx-to-literals/components/for');
		const fragmentComp =
			await import('@gracile-labs/babel-plugin-jsx-to-literals/components/fragment');
		const showComp =
			await import('@gracile-labs/babel-plugin-jsx-to-literals/components/show');

		assert.equal(typeof forComp.For, 'function');
		assert.equal(typeof fragmentComp.Fragment, 'function');
		assert.equal(typeof showComp.Show, 'function');

		noop(forComp, fragmentComp, showComp);
	});
});
