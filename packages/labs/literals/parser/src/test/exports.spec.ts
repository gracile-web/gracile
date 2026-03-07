import { expect } from 'chai';
import * as pl from '../index.js';
import { parseLiterals } from '../parseLiterals.js';
import typescript from '../strategies/typescript.js';
import { describe, it } from 'node:test';

describe('exports', () => {
  it('should export parseLiterals() function', () => {
    expect(pl.parseLiterals).to.equal(parseLiterals);
  });

  it('should export strategies map', () => {
    expect(pl.strategies).to.deep.equal({
      typescript,
    });
  });
});
