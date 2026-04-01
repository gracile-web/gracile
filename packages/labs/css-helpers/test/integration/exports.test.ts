/* eslint-disable @typescript-eslint/no-floating-promises */

import '@gracile-labs/css-helpers/ambient';

import assert from 'node:assert';
import { describe, test } from 'node:test';

import * as cssHelpersGlobalCss from '@gracile-labs/css-helpers/global-css-provider';
import * as cssHelpersSharedStyle from '@gracile-labs/css-helpers/shared-style-provider';
import * as cssHelpersDedupRenderer from '@gracile-labs/css-helpers/dedup-renderer';
import { html } from 'lit';

import { noop } from '@gracile/internal-test-utils/noop';

describe('@gracile-labs/css-helpers exports', () => {
	test('global styles provider', () => {
		assert.equal(typeof cssHelpersGlobalCss.GlobalStylesProvider, 'function');

		const globalStyles =
			null as unknown as HTMLElementTagNameMap['adopt-global-styles'];

		const elems = html` <route-template-outlet></route-template-outlet> `;
		noop(globalStyles, elems);
	});

	test('shared style provider', () => {
		assert.equal(typeof cssHelpersSharedStyle.SharedStyleProvider, 'function');

		const sharedStyle =
			null as unknown as HTMLElementTagNameMap['adopt-shared-style'];

		noop(sharedStyle);
	});

	test('dedup renderer', () => {
		assert.equal(
			typeof cssHelpersDedupRenderer.DedupLitElementRenderer,
			'function',
		);
	});

	test('plugin', async () => {
		const cssHelpersPlugin = await import('@gracile-labs/css-helpers/plugin');
		assert.equal(typeof cssHelpersPlugin.dsdStyleDedup, 'function');
	});
});
