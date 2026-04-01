/* eslint-disable @typescript-eslint/no-floating-promises */

import '@gracile-labs/css-helpers/ambient';

import assert from 'node:assert';
import { describe, test } from 'node:test';

import * as cssHelpersGlobalCss from '@gracile-labs/css-helpers/global/provider';
import * as cssHelpersSharedStyle from '@gracile-labs/css-helpers/shared/provider';
import * as cssHelpersDedupRenderer from '@gracile-labs/css-helpers/shared/dedup-renderer';
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

	test('plugins', async () => {
		const cssHelpersPluginGlobal =
			await import('@gracile-labs/css-helpers/global/vite');
		assert.equal(typeof cssHelpersPluginGlobal.globalStylesAdopter, 'function');

		const cssHelpersPluginShared =
			await import('@gracile-labs/css-helpers/shared/vite');
		assert.equal(typeof cssHelpersPluginShared.dsdStyleDedup, 'function');
	});
});
