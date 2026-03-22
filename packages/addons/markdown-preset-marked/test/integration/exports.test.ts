/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from 'node:assert';
import { describe, test } from 'node:test';

import * as mdPresetMarked from '@gracile/markdown-preset-marked/renderer';

describe('@gracile/markdown-preset-marked exports', () => {
	test('MarkdownRenderer', () => {
		assert.equal(typeof mdPresetMarked.MarkdownRenderer, 'function');
	});
});
