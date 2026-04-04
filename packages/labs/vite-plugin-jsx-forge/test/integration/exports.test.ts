/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { noop } from '@gracile/internal-test-utils/noop';

describe('vite-plugin-jsx-forge package should export correctly', () => {
	test('vite plugin module resolves', async () => {
		const { gracileJsxTs } =
			await import('@gracile-labs/vite-plugin-jsx-forge/to-literals');

		assert.equal(typeof gracileJsxTs, 'function');

		const plugins = gracileJsxTs();
		assert.equal(Array.isArray(plugins), true);
		assert.equal(plugins.length > 0, true);

		noop(plugins);
	});

	test('class-list re-export', async () => {
		const classList =
			await import('@gracile-labs/vite-plugin-jsx-forge/_internal/class-list');

		assert.equal(typeof classList.clsx, 'function');

		noop(classList);
	});
});
