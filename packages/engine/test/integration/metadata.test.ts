/**
 * Metadata addon test (static-site dev server).
 *
 * Verifies that `createMetadata()` injects the correct meta tags.
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

describe('metadata addon (static-site)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site');
	});

	after(async () => {
		await server?.close();
	});

	it('renders page with metadata tags', async () => {
		const html = await getText(server.address, '/09-metadata/00-metadata');
		const $ = parseHtml(html);

		assertH1($, 'Hello Metadata');

		// Check meta tags from createMetadata()
		assertExists($, 'meta[name="author"]');
		assertExists($, 'meta[name="description"]');
		assertExists($, 'meta[name="generator"]');
		assertExists($, 'link[rel="canonical"]');

		// Check breadcrumbs JSON-LD
		assertBodyIncludes(html, 'application/ld+json');
	});
});
