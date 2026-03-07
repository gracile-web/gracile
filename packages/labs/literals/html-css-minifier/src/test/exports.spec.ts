import { expect } from 'chai';
import * as min from '../index.js';
import {
  defaultGenerateSourceMap,
  defaultShouldMinify,
  defaultShouldMinifyCSS,
  defaultValidation,
  minifyHTMLLiterals,
} from '../minifyHTMLLiterals.js';
import {
  adjustMinifyCSSOptions,
  defaultMinifyCSSOptions,
  defaultMinifyOptions,
  defaultStrategy,
} from '../strategy.js';
import { describe, it } from 'node:test';

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
