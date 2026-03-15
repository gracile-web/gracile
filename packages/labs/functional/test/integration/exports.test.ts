/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { noop } from '@gracile/internal-test-utils/noop';

describe('functional package should export correctly', () => {
	test('main export', async () => {
		const mod = await import('@gracile-labs/functional');

		assert.equal(typeof mod.withFunctional, 'function');
		assert.equal(typeof mod.setSignalConstructor, 'function');

		noop(mod);
	});

	test('hooks export', async () => {
		const hooks = await import('@gracile-labs/functional/hooks');

		assert.ok(hooks);

		noop(hooks);
	});

	test('context export', async () => {
		const context = await import('@gracile-labs/functional/context');

		assert.ok(context);

		noop(context);
	});
});
