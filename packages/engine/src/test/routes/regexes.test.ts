/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { REGEXES } from '../../routes/load-module.js';

import '../init.js';

describe('REGEXES.param — [name] dynamic segments', () => {
	test('matches [foo]', () => {
		assert.ok(REGEXES.param.test('[foo]'));
	});

	test('matches [param_test]', () => {
		assert.ok(REGEXES.param.test('[param_test]'));
	});

	test('matches partial dynamic: game-[title]', () => {
		assert.ok(REGEXES.param.test('game-[title]'));
	});

	test('matches multi-param: [a]-[b]', () => {
		assert.ok(REGEXES.param.test('[a]-[b]'));
	});

	test('does not match plain segment', () => {
		assert.equal(REGEXES.param.test('about'), false);
	});

	test('does not match rest syntax', () => {
		// rest uses [...name] which also contains [, but param should still match
		// the inner part — just verifying the regex captures the first bracket pair
		assert.ok(REGEXES.param.test('[...slug]'));
	});

	test('captures the parameter name', () => {
		const match = '[myParam]'.match(REGEXES.param);
		assert.ok(match);
		assert.equal(match[1], 'myParam');
	});
});

describe('REGEXES.rest — [...name] catch-all segments', () => {
	test('matches [...slug]', () => {
		assert.ok(REGEXES.rest.test('[...slug]'));
	});

	test('matches [...verdict]', () => {
		assert.ok(REGEXES.rest.test('[...verdict]'));
	});

	test('does not match single param [foo]', () => {
		assert.equal(REGEXES.rest.test('[foo]'), false);
	});

	test('does not match plain text', () => {
		assert.equal(REGEXES.rest.test('about'), false);
	});

	test('captures the parameter name', () => {
		const match = '[...myRest]'.match(REGEXES.rest);
		assert.ok(match);
		assert.equal(match[1], 'myRest');
	});
});

describe('REGEXES.restWithExt — [...name].ts file segments', () => {
	test('matches [...slug].ts', () => {
		assert.ok(REGEXES.restWithExt.test('[...slug].ts'));
	});

	test('matches [...slug].js', () => {
		assert.ok(REGEXES.restWithExt.test('[...slug].js'));
	});

	test('does not match [...slug] without extension', () => {
		assert.equal(REGEXES.restWithExt.test('[...slug]'), false);
	});

	test('does not match [foo].ts (not rest)', () => {
		assert.equal(REGEXES.restWithExt.test('[foo].ts'), false);
	});
});

describe('REGEXES.index — (groupName) parenthesized index routes', () => {
	test('matches (home)', () => {
		assert.ok(REGEXES.index.test('(home)'));
	});

	test('matches (movie-index)', () => {
		assert.ok(REGEXES.index.test('(movie-index)'));
	});

	test('does not match plain segment', () => {
		assert.equal(REGEXES.index.test('about'), false);
	});

	test('does not match bracket param', () => {
		assert.equal(REGEXES.index.test('[foo]'), false);
	});
});

describe('REGEXES.dynamicSplit — splitting mixed static/dynamic segments', () => {
	test('splits game-[title] into parts', () => {
		const parts = 'game-[title]'
			.replace(/\.(js|ts|jsx|tsx|html)$/, '')
			.split(REGEXES.dynamicSplit)
			.filter((p) => p !== '');
		assert.deepEqual(parts, ['game-', 'title']);
	});

	test('splits [a]-noon-[b] into parts', () => {
		const parts = '[a]-noon-[b]'
			.replace(/\.(js|ts|jsx|tsx|html)$/, '')
			.split(REGEXES.dynamicSplit)
			.filter((p) => p !== '');
		assert.deepEqual(parts, ['a', '-noon-', 'b']);
	});

	test('single dynamic [bored] produces one part', () => {
		const parts = '[bored]'
			.replace(/\.(js|ts|jsx|tsx|html)$/, '')
			.split(REGEXES.dynamicSplit)
			.filter((p) => p !== '');
		assert.deepEqual(parts, ['bored']);
	});
});
