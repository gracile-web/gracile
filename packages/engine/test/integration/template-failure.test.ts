/**
 * Template failure recovery test (static-site dev server).
 *
 * Verifies that when a Lit template contains failing expressions,
 * the page still renders with error recovery.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, before, describe, it } from 'node:test';

import { getText } from '@gracile/internal-test-utils/fetch';
import {
	assertBodyIncludes,
	assertH1,
	parseHtml,
} from '@gracile/internal-test-utils/html';
import {
	createTestServer,
	type TestServer,
} from '@gracile/internal-test-utils/server';

describe('template failure recovery (static-site)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site');
	});

	after(async () => {
		await server?.close();
	});

	it('renders page despite failing template expressions', async () => {
		const html = await getText(
			server.address,
			'/04-template-failure/04-template-failure',
		);
		const $ = parseHtml(html);
		assertH1($, 'Hello Polyfills');
		// Verify error recovery rendered content before and after failing expressions
		assertBodyIncludes(html, 'FAILING-1');
		assertBodyIncludes(html, 'FAILING-2');
		assertBodyIncludes(html, 'FAILING-9');
	});
});
