/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import { parseLiterals } from '../parse-literals.js';

import createParseTests from './parse-tests.js';

describe('parseLiterals()', () => {
	it('should allow overriding strategy', () => {
		const result: any[] = [];
		const strategy = {
			getRootNode: mock.fn((_source: string) => ({})),
			walkNodes: mock.fn(() => result),
			isTaggedTemplate: mock.fn(() => false),
			getTagText: mock.fn((): string => ''),
			getTaggedTemplateTemplate: mock.fn((_node: any) => ({})),
			isTemplate: mock.fn(() => false),
			getTemplateParts: mock.fn((): any[] => []),
		};

		parseLiterals('true', { strategy });
		assert.strictEqual(strategy.getRootNode.mock.callCount(), 1);
		assert.deepStrictEqual(
			strategy.getRootNode.mock.calls[0]!.arguments[0],
			'true',
		);
		assert.ok(strategy.walkNodes.mock.callCount() > 0);
	});

	createParseTests();
});
