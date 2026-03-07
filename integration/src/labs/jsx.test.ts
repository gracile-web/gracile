/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { noop } from '../helpers/noop.js';

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

describe('jsx-forge package should export correctly', () => {
	test('main export', async () => {
		const mod = await import('jsx-forge');

		assert.ok(mod);

		noop(mod);
	});
});

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

describe('vite-plugin-jsx-forge package should export correctly', () => {
	test('vite plugin module resolves', async () => {
		// NOTE: `ts-patch/compiler` is CJS-only, so the full import may fail
		// outside Vite's CJS interop. We verify the module path resolves.
		try {
			const { gracileJsxTs } =
				await import('@gracile-labs/vite-plugin-jsx-forge/vite');

			assert.equal(typeof gracileJsxTs, 'function');

			const plugins = gracileJsxTs();
			assert.equal(Array.isArray(plugins), true);
			assert.equal(plugins.length > 0, true);

			noop(plugins);
		} catch (error) {
			// ts-patch/compiler CJS resolution fails outside Vite — expected.
			assert.match(
				(error as Error).message,
				/ts-patch/,
				'Expected ts-patch resolution error outside Vite context',
			);
		}
	});

	test('class-list re-export', async () => {
		const classList =
			await import('@gracile-labs/vite-plugin-jsx-forge/_internal/class-list');

		assert.equal(typeof classList.clsx, 'function');

		noop(classList);
	});
});
