/**
 * Basic routing tests (static-site dev server).
 *
 * Verifies core routing: 404 handling, basic routes, doc-only routes,
 * handler props passing, and parameterized routes.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, before, describe, it } from 'node:test';

import { getText } from './helpers/fetch.js';
import {
	assertBodyIncludes,
	assertH1,
	assertTextIncludes,
	assertTitle,
	parseHtml,
} from './helpers/html.js';
import { createTestServer, type TestServer } from './helpers/server.js';

describe('basic routing (static-site)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site');
	});

	after(async () => {
		await server?.close();
	});

	it('serves 404 for unknown route', async () => {
		const html = await getText(server.address, '/does_not_exist');
		const $ = parseHtml(html);
		assertH1($, '⚠️ 404 not found!!');
		assertBodyIncludes(html, 'not found');
	});

	it('serves 404 page directly', async () => {
		const html = await getText(server.address, '/404');
		const $ = parseHtml(html);
		assertTitle($, 'Document - Minimal - Gracile - 404');
		assertH1($, '⚠️ 404 not found!!');
	});

	it('returns error page for route that throws', async () => {
		const html = await getText(server.address, '/throws');
		assertBodyIncludes(html, '500');
	});

	it('serves basic route', async () => {
		const html = await getText(server.address, '/00-routes/00-basic');
		const $ = parseHtml(html);
		assertTitle($, 'Document - Minimal - Untitled');
		assertH1($, 'Hello world');
		assertTextIncludes($, 'code', '/00-routes/00-basic/');
	});

	it('serves doc-only route', async () => {
		const html = await getText(server.address, '/00-routes/01-doc-only');
		const $ = parseHtml(html);
		assertTitle($, 'Document');
		assertBodyIncludes(html, 'Only a bare doc!');
	});

	it('passes props for top-level handler', async () => {
		const html = await getText(server.address, '/00-routes/02-top-handler');
		const $ = parseHtml(html);
		assertH1($, 'Hello world');
		assertBodyIncludes(html, '/00-routes/02-top-handler/');
		assertBodyIncludes(html, 'foo');
	});

	it('passes props for GET handler', async () => {
		const html = await getText(server.address, '/00-routes/03-get-handler');
		const $ = parseHtml(html);
		assertH1($, 'Hello world');
		assertBodyIncludes(html, '/00-routes/03-get-handler/');
		assertBodyIncludes(html, 'foo');
	});

	it('serves parameterized route — omega', async () => {
		const html = await getText(server.address, '/00-routes/01-param/omega');
		const $ = parseHtml(html);
		assertH1($, 'One param (static route) - Omega');
		assertTextIncludes($, 'code', '/00-routes/01-param/omega/');
	});

	it('serves parameterized route — jupiter', async () => {
		const html = await getText(server.address, '/00-routes/01-param/jupiter');
		const $ = parseHtml(html);
		assertH1($, 'One param (static route) - Jupiter');
		assertTextIncludes($, 'code', '/00-routes/01-param/jupiter/');
	});
});
