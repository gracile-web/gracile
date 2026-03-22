/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as min from '../index.js';
import {
	defaultGenerateSourceMap,
	defaultShouldMinify,
	defaultShouldMinifyCSS,
	defaultValidation,
	minifyHTMLLiterals,
} from '../minify-html-literals.js';
import {
	defaultMinifyCSSOptions,
	defaultMinifyOptions,
	defaultStrategy,
} from '../strategy.js';
import {
	extractTypeScriptScripts,
	stripTypeScriptInScripts,
} from '../strip-types.js';

describe('exports', () => {
	it('should export minifyHTMLLiterals() function and defaults', () => {
		assert.deepStrictEqual(
			{ ...min },
			{
				defaultGenerateSourceMap,
				defaultMinifyCSSOptions,
				defaultMinifyOptions,
				defaultShouldMinify,
				defaultShouldMinifyCSS,
				defaultStrategy,
				defaultValidation,
				extractTypeScriptScripts,
				minifyHTMLLiterals,
				stripTypeScriptInScripts,
			},
		);
	});
});
