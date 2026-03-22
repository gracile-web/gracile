/**
 * Markdown addon test (static-site dev server).
 *
 * Verifies that markdown files imported with `{ type: 'md-lit' }` render
 * correctly, with body, metadata, and source information accessible.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, before, describe, it } from 'node:test';

import { getText } from '@gracile/internal-test-utils/fetch';
import {
	assertBodyIncludes,
	assertExists,
	assertH1,
	parseHtml,
} from '@gracile/internal-test-utils/html';
import {
	createTestServer,
	type TestServer,
} from '@gracile/internal-test-utils/server';

describe('markdown addon (static-site)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site');
	});

	after(async () => {
		await server?.close();
	});

	it('renders markdown with marked preset', async () => {
		const html = await getText(server.address, '/11-markdown/05-preset-marked');
		const $ = parseHtml(html);

		assertH1($, 'Hello Markown - Marked');
		// Check that details/summary sections are rendered
		assertExists($, 'details');
		assertExists($, 'summary');
		// Check that body.lit rendered markdown content
		assertBodyIncludes(html, 'body.lit');
		// Check that metadata sections exist
		assertBodyIncludes(html, 'meta.frontmatter');
		assertBodyIncludes(html, 'meta.tableOfContents');
		assertBodyIncludes(html, 'meta.title');
	});
});
