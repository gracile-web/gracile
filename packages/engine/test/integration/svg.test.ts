/**
 * SVG addon test (static-site dev server).
 *
 * Verifies that SVG files imported with `{ type: 'svg-lit' }` render
 * as inline SVG elements in the page.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, before, describe, it } from 'node:test';

import { getText } from '@gracile/internal-test-utils/fetch';
import {
	assertExists,
	assertH1,
	parseHtml,
} from '@gracile/internal-test-utils/html';
import {
	createTestServer,
	type TestServer,
} from '@gracile/internal-test-utils/server';

describe('SVG addon (static-site)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site');
	});

	after(async () => {
		await server?.close();
	});

	it('renders page with inline SVG elements', async () => {
		const html = await getText(server.address, '/10-svg/00-svg');
		const $ = parseHtml(html);

		assertH1($, 'Hello SVGs');
		// Each imported SVG should render as an inline <svg> element
		assertExists($, 'svg');
	});
});
