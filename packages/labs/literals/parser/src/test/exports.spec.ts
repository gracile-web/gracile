/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as pl from '../index.js';
import { parseLiterals } from '../parse-literals.js';
import typescript from '../strategies/typescript.js';

describe('exports', () => {
	it('should export parseLiterals() function', () => {
		assert.strictEqual(pl.parseLiterals, parseLiterals);
	});

	it('should export strategies map', () => {
		assert.deepStrictEqual(pl.strategies, {
			typescript,
		});
	});
});
