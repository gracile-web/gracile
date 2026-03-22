/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, beforeEach, it, mock } from 'node:test';
import * as path from 'node:path';
import assert from 'node:assert/strict';

import * as minify from '@literals/html-css-minifier';
import { TransformPluginContext } from 'rollup';

import { literalsHtmlCssMinifier, Options } from '../index.js';

describe('minify-html-literals', () => {
	const fileName = path.resolve('test.js');
	let context: {
		warn: ReturnType<typeof mock.fn>;
		error: ReturnType<typeof mock.fn>;
	};
	beforeEach(() => {
		context = {
			warn: mock.fn(),
			error: mock.fn(),
		};
	});

	it('should return a plugin with a transform function', () => {
		const plugin = literalsHtmlCssMinifier();
		assert.ok(typeof plugin === 'object');
		assert.ok(typeof plugin.name === 'string');
		assert.ok(typeof plugin.transform === 'function');
	});

	it('should call minifyHTMLLiterals()', () => {
		const options: Options = {};
		const plugin = literalsHtmlCssMinifier(options);
		assert.ok(typeof options.minifyHTMLLiterals === 'function');
		const original = options.minifyHTMLLiterals!;
		let called = false;
		options.minifyHTMLLiterals = (...args: any[]) => {
			called = true;
			return (original as any)(...args);
		};
		plugin.transform.apply(context as unknown as TransformPluginContext, [
			'return',
			fileName,
		]);
		assert.ok(called);
	});

	it('should pass id and options to minifyHTMLLiterals()', () => {
		const options: Options = {
			options: {
				minifyOptions: {
					minifyCSS: false,
				},
			},
		};

		const plugin = literalsHtmlCssMinifier(options);
		let capturedArgs: any[] = [];
		const original = options.minifyHTMLLiterals!;
		options.minifyHTMLLiterals = (...args: any[]) => {
			capturedArgs = args;
			return (original as any)(...args);
		};
		plugin.transform.apply(context as unknown as TransformPluginContext, [
			'return',
			fileName,
		]);
		assert.ok(capturedArgs.length >= 2);
		assert.ok(typeof capturedArgs[0] === 'string');
		assert.strictEqual(capturedArgs[1].fileName, fileName);
		assert.strictEqual(capturedArgs[1].minifyOptions.minifyCSS, false);
	});

	it('should allow custom minifyHTMLLiterals', () => {
		const customMinify = mock.fn((source: string, options?: minify.Options) => {
			return minify.minifyHTMLLiterals(source, options);
		});

		const plugin = literalsHtmlCssMinifier({
			minifyHTMLLiterals: customMinify,
		});

		plugin.transform.apply(context as unknown as TransformPluginContext, [
			'return',
			fileName,
		]);
		assert.ok(customMinify.mock.callCount() > 0);
	});

	it('should warn errors', () => {
		const plugin = literalsHtmlCssMinifier({
			minifyHTMLLiterals: () => {
				throw new Error('failed');
			},
		});

		plugin.transform.apply(context as unknown as TransformPluginContext, [
			'return',
			fileName,
		]);
		assert.ok(context.warn.mock.callCount() > 0);
		assert.strictEqual(context.warn.mock.calls[0].arguments[0], 'failed');
		assert.strictEqual(context.error.mock.callCount(), 0);
	});

	it('should fail is failOnError is true', () => {
		const plugin = literalsHtmlCssMinifier({
			minifyHTMLLiterals: () => {
				throw new Error('failed');
			},
			failOnError: true,
		});

		plugin.transform.apply(context as unknown as TransformPluginContext, [
			'return',
			fileName,
		]);
		assert.ok(context.error.mock.callCount() > 0);
		assert.strictEqual(context.error.mock.calls[0].arguments[0], 'failed');
		assert.strictEqual(context.warn.mock.callCount(), 0);
	});

	it('should filter ids', () => {
		let options: Options = {};
		literalsHtmlCssMinifier(options);
		assert.ok(typeof options.filter === 'function');
		assert.strictEqual(options.filter!(fileName), true);
		options = {
			include: '*.ts',
		};

		literalsHtmlCssMinifier(options);
		assert.ok(typeof options.filter === 'function');
		assert.strictEqual(options.filter!(fileName), false);
		assert.strictEqual(options.filter!(path.resolve('test.ts')), true);
	});

	it('should allow custom filter', () => {
		const filterFn = mock.fn((_id: string) => false);

		const plugin = literalsHtmlCssMinifier({
			filter: filterFn,
		});

		plugin.transform.apply(context as unknown as TransformPluginContext, [
			'return',
			fileName,
		]);
		assert.ok(filterFn.mock.callCount() > 0);
		assert.strictEqual(filterFn.mock.calls[0].arguments[0], fileName);
	});
});
