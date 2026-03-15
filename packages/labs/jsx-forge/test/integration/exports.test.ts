/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { noop } from '@gracile/internal-test-utils/noop';

describe('jsx-forge package should export correctly', () => {
	test('main export', async () => {
		const mod = await import('jsx-forge');

		assert.ok(mod);

		noop(mod);
	});
});
