/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, it } from 'node:test';

import { expect } from 'chai';

import * as min from '../index.js';
import {
	defaultGenerateSourceMap,
	defaultShouldMinify,
	defaultShouldMinifyCSS,
	defaultValidation,
	minifyHTMLLiterals,
} from '../minify-html-literals.js';
import {
	adjustMinifyCSSOptions,
	defaultMinifyCSSOptions,
	defaultMinifyOptions,
	defaultStrategy,
} from '../strategy.js';

describe('exports', () => {
	it('should export minifyHTMLLiterals() function and defaults', () => {
		expect({ ...min }).to.deep.equal({
			adjustMinifyCSSOptions,
			defaultGenerateSourceMap,
			defaultMinifyCSSOptions,
			defaultMinifyOptions,
			defaultShouldMinify,
			defaultShouldMinifyCSS,
			defaultStrategy,
			defaultValidation,
			minifyHTMLLiterals,
		});
	});
});
