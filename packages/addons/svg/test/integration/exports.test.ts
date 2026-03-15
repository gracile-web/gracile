/* eslint-disable @typescript-eslint/no-floating-promises */

import '@gracile/svg/ambient';

import assert from 'node:assert';
import { describe, test } from 'node:test';

import * as svg from '@gracile/svg/vite';
import { html } from 'lit';

import { noop } from '@gracile/internal-test-utils/noop';

describe('@gracile/svg exports', () => {
	test('vite plugin', () => {
		assert.equal(typeof svg.viteSvgPlugin, 'function');
	});

	test('ambient types', () => {
		// NOTE: AMBIENT
		const t1: typeof import('./dummy.svg') = { default: html`abc` };

		noop(t1);
	});
});
