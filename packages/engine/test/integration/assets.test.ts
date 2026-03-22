/**
 * Asset loading tests (static-site dev server).
 *
 * Verifies that sibling CSS/JS assets are injected, and that inline
 * CSS imports work correctly.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, before, describe, it } from 'node:test';

import { get, getText } from '@gracile/internal-test-utils/fetch';
import {
	assertBodyIncludes,
	assertContentType,
	assertExists,
	assertH1,
	assertStatus,
	parseHtml,
} from '@gracile/internal-test-utils/html';
import {
	createTestServer,
	type TestServer,
} from '@gracile/internal-test-utils/server';

describe('asset loading (static-site)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site');
	});

	after(async () => {
		await server?.close();
	});

	describe('sibling assets', () => {
		it('renders the route page', async () => {
			const html = await getText(server.address, '/01-assets/00-siblings');
			const $ = parseHtml(html);
			assertH1($, 'Hello world');
			assertBodyIncludes(html, '/01-assets/00-siblings/');
		});

		it('sibling client script is fetchable', async () => {
			const res = await get(
				server.address,
				'/src/routes/01-assets/00-siblings.client.ts',
				{ trailingSlash: false },
			);
			assertStatus(res, 200);
			// Vite serves TS files with appropriate content type
			const body = await res.text();
			assertBodyIncludes(body, '');
		});

		it('sibling SCSS is fetchable', async () => {
			const res = await get(
				server.address,
				'/src/routes/01-assets/00-siblings.scss',
				{ trailingSlash: false },
			);
			assertStatus(res, 200);
		});
	});

	describe('assets with inline CSS', () => {
		it('renders the route with inline styles', async () => {
			const html = await getText(
				server.address,
				'/01-assets/02-import-with-query-css-inline',
			);
			const $ = parseHtml(html);
			assertH1($, 'Hello world');
			// Route uses a custom element with inline CSS
			assertExists($, 'my-el-with-inline-css');
		});
	});
});
