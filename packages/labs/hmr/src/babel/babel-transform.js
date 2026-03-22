/** @typedef {import('./babel-plugin-wc-hmr.js').BabelPluginWcHmrOptions} BabelPluginWcHmrOptions */

import { createRequire } from 'node:module';

import { transformAsync } from '@babel/core';

import { createError } from '../utils.js';

import babelPluginWcHmr from './babel-plugin-wc-hmr.js';

const require = createRequire(import.meta.url);

/**
 * @param {string} code
 * @param {string} filename
 * @param {BabelPluginWcHmrOptions} options
 * @return {Promise<import('@babel/core').BabelFileResult>}
 */
export async function babelTransform(code, filename, options) {
	const largeFile = code.length > 100_000;
	const result = await transformAsync(code, {
		caller: {
			name: '@gracile-labs/hmr',
			supportsStaticESM: true,
		},
		plugins: [
			[babelPluginWcHmr, options],
			require.resolve('@babel/plugin-syntax-class-properties'),
			[
				require.resolve('@babel/plugin-syntax-import-attributes'),
				{ deprecatedAssertSyntax: true },
			],
			require.resolve('@babel/plugin-syntax-top-level-await'),
		],
		filename,
		babelrc: false,
		configFile: false,
		compact: largeFile,
		sourceType: 'module',
		sourceMaps: true,
	});

	if (!result || !result.code) {
		throw createError(`Failed to babel transform ${filename}`);
	}

	return result;
}
