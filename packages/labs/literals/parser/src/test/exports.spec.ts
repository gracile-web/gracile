/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, it } from 'node:test';

import { expect } from 'chai';

import * as pl from '../index.js';
import { parseLiterals } from '../parse-literals.js';
import typescript from '../strategies/typescript.js';

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
