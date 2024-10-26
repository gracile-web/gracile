/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { html as serverHtml } from '@lit-labs/ssr';
import { html } from 'lit';

import {
	isLitNormalTemplate,
	isLitServerTemplate,
	isLitTemplate,
	isResponseOrPatchedResponse,
	isUnknownObject,
} from './assertions.js';

describe('should assert lit templates, unknown objects', () => {
	const lit = html` <div>Hello</div> `;
	const litServer = serverHtml` <div>Hello</div> `;

	test('assert lit any', () => {
		assert.equal(isLitTemplate(lit), true);
		assert.equal(isLitTemplate(litServer), true);
	});

	test('assert lit normal', () => {
		assert.equal(isLitNormalTemplate(lit), true);
	});
	test('assert lit server', () => {
		assert.equal(isLitServerTemplate(litServer), true);
	});
	test('wrong lit templates', () => {
		assert.equal(isLitTemplate([]), false);
		assert.equal(isLitNormalTemplate([]), false);
		assert.equal(isLitServerTemplate([]), false);
	});
});

describe('should assert unknown objects', () => {
	test('unknown object', () => {
		assert.equal(isUnknownObject({ something: 'something' } as never), true);
	});
	//
});

describe('should assert responses', () => {
	test('assert standard response', () => {
		assert.equal(
			isResponseOrPatchedResponse(
				new Response('hey', { headers: { foo: 'bar' } }),
			),
			true,
		);
	});

	test('assert patched standard response', () => {
		assert.equal(
			isResponseOrPatchedResponse(
				new (class Response {
					url: null = null;

					body: null = null;

					bodyUsed: null = null;

					headers: null = null;

					status: null = null;

					statusText: null = null;
				})(),
			),
			true,
		);
	});
});
