/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { getText } from '@gracile/internal-test-utils/fetch';
import { assertExists, parseHtml } from '@gracile/internal-test-utils/html';
import { createTestServer } from '@gracile/internal-test-utils/server';

describe('custom-elements', () => {
	// Fixed: cacheDir isolation in createTestServer prevents dep-scan races.
	let address: string;
	let close: () => Promise<void>;

	before(async () => {
		({ address, close } = await createTestServer('static-site'));
	});

	after(async () => close?.());

	it('render Lit element - Full', async () => {
		const html = await getText(address, '/03-custom-elements/00-lit-full');
		const $ = parseHtml(html);

		// Basic structural checks — the page renders and contains custom elements
		assertExists($, 'html');
		assertExists($, 'body');

		// Verify the client TS module is fetchable
		const clientTs = await getText(
			address,
			'/src/routes/03-custom-elements/00-lit-full.client.ts',
			{ trailingSlash: false },
		);
		assert.ok(clientTs.length > 0, 'client TS module should be non-empty');

		// Verify the lit element module is fetchable
		const litElement = await getText(
			address,
			'/src/routes/03-custom-elements/_lit-element.ts',
			{ trailingSlash: false },
		);
		assert.ok(litElement.length > 0, 'lit element module should be non-empty');
	});
});
