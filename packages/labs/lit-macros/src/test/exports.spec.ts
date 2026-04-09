/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as mod from '../index.js';

describe('exports', () => {
	it('should export the plugin factory function', () => {
		assert.ok(typeof mod.litMacros === 'function');
	});

	it('should export the core transform function', () => {
		assert.ok(typeof mod.transformLitMacros === 'function');
	});

	it('should export resolve helpers', () => {
		assert.ok(typeof mod.resolveParseSync === 'function');
		assert.ok(typeof mod.resolveVisitor === 'function');
	});
});
