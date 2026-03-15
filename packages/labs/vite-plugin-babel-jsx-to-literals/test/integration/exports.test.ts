/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { noop } from '@gracile/internal-test-utils/noop';

describe('vite-plugin-babel-jsx-to-literals package should export correctly', () => {
	test('vite plugin', async () => {
		const { gracileJsx } =
			await import('@gracile-labs/vite-plugin-babel-jsx-to-literals/vite');

		assert.equal(typeof gracileJsx, 'function');

		const plugins = gracileJsx();
		assert.equal(Array.isArray(plugins), true);
		assert.equal(plugins.length > 0, true);

		noop(plugins);
	});

	test('cem plugin default options', async () => {
		const { cemPluginDefaultOptions } =
			await import('@gracile-labs/vite-plugin-babel-jsx-to-literals/vite');

		assert.equal(typeof cemPluginDefaultOptions, 'object');
		assert.equal(typeof cemPluginDefaultOptions.outdir, 'string');
		assert.equal(typeof cemPluginDefaultOptions.fileName, 'string');

		noop(cemPluginDefaultOptions);
	});
});
