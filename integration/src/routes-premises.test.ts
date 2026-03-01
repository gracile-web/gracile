/**
 * Route premises tests (static-site dev server).
 *
 * Verifies that route premises (props.json and doc.html endpoints) work,
 * and that the full page renders with handler-provided props.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { get, getText } from './helpers/fetch.js';
import {
	assertBodyIncludes,
	assertH1,
	assertStatus,
	parseHtml,
} from './helpers/html.js';
import { createTestServer, type TestServer } from './helpers/server.js';

describe('route premises (static-site)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site');
	});

	after(async () => {
		await server?.close();
	});

	describe('zebra page', () => {
		it('props.json returns handler data', async () => {
			const res = await get(
				server.address,
				'/12-route-premises/01-page-zebra/__index.props.json',
				{ trailingSlash: false },
			);
			assertStatus(res, 200);
			const json = (await res.json()) as Record<string, unknown>;
			assert.equal(json.title, 'Hello Client Router - Zebra');
			assert.equal(json.foo, 'baz');
		});

		it('doc.html returns document fragment', async () => {
			const res = await get(
				server.address,
				'/12-route-premises/01-page-zebra/__index.doc.html',
				{ trailingSlash: false },
			);
			assertStatus(res, 200);
			const body = await res.text();
			assertBodyIncludes(body, '<html');
			assertBodyIncludes(body, 'route-template-outlet');
		});

		it('full page renders with props', async () => {
			const html = await getText(
				server.address,
				'/12-route-premises/01-page-zebra',
			);
			const $ = parseHtml(html);
			assertH1($, 'Hello Client Router - Zebra');
			assertBodyIncludes(html, '/12-route-premises/01-page-zebra/');
		});
	});

	describe('lion page', () => {
		it('props.json returns handler data', async () => {
			const res = await get(
				server.address,
				'/12-route-premises/02-page-lion/__index.props.json',
				{ trailingSlash: false },
			);
			assertStatus(res, 200);
			const json = (await res.json()) as Record<string, unknown>;
			assert.equal(json.title, 'Hello Client Router - Lion');
		});

		it('doc.html returns document fragment', async () => {
			const res = await get(
				server.address,
				'/12-route-premises/02-page-lion/__index.doc.html',
				{ trailingSlash: false },
			);
			assertStatus(res, 200);
			const body = await res.text();
			assertBodyIncludes(body, '<html');
		});

		it('full page renders with props', async () => {
			const html = await getText(
				server.address,
				'/12-route-premises/02-page-lion',
			);
			const $ = parseHtml(html);
			assertH1($, 'Hello Client Router - Lion');
			assertBodyIncludes(html, '/12-route-premises/02-page-lion/');
		});
	});
});
