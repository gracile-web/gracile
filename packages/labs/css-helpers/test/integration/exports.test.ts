/* eslint-disable @typescript-eslint/no-floating-promises */

import '@gracile-labs/css-helpers/ambient';

import assert from 'node:assert';
import { describe, test } from 'node:test';

import * as cssHelpersGlobalCss from '@gracile-labs/css-helpers/global-css-provider';
import { html } from 'lit';

import { noop } from '@gracile/internal-test-utils/noop';

describe('@gracile-labs/css-helpers exports', () => {
	test('global styles provider', () => {
		assert.equal(typeof cssHelpersGlobalCss.globalStylesProvider, 'function');

		const globalStyles =
			null as unknown as HTMLElementTagNameMap['adopt-global-styles'];

		const elems = html` <route-template-outlet></route-template-outlet> `;
		noop(globalStyles, elems);
	});
});
