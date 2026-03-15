/**
 * Common server-mode test suite (shared between Express and Hono tests).
 *
 * Uses structural assertions instead of full-HTML snapshot comparison.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { get, getText } from '@gracile/internal-test-utils/fetch';
import {
	assertBodyIncludes,
	assertContentType,
	assertH1,
	assertHeader,
	assertRedirected,
	assertStatus,
	assertTitleIncludes,
	parseHtml,
} from '@gracile/internal-test-utils/html';
import { api } from './_api.js';

export async function common(address: string, item: string) {
	await describe(`server routes — ${item}`, async () => {
		await it(`static asset from public dir — ${item}`, async () => {
			const res = await get(address, '/favicon.svg', { trailingSlash: false });
			assertStatus(res, 200);
			assertContentType(res, 'image/svg');
		});

		await it(`page has html mime type — ${item}`, async () => {
			const res = await get(address, '/about');
			assertContentType(res, 'text/html');
		});

		await it(`404 page — ${item}`, async () => {
			const html = await getText(address, '/404');
			const $ = parseHtml(html);
			assertH1($, '⚠️ 404 !!');
			assertBodyIncludes(html, 'not found');
		});

		await it(`basic page (about) — ${item}`, async () => {
			const html = await getText(address, '/about');
			const $ = parseHtml(html);
			assertH1($, 'the About Page');
			assertTitleIncludes($, 'Gracile About');
		});

		await it(`prerendered page (contact) — ${item}`, async () => {
			const html = await getText(address, '/contact');
			const $ = parseHtml(html);
			assertH1($, 'the Contact Page');
			assertTitleIncludes($, 'Gracile Contact');
		});

		await describe(`route premises — ${item}`, async () => {
			await it(`full page — ${item}`, async () => {
				const html = await getText(address, '/route-premises');
				const $ = parseHtml(html);
				assertH1($, 'Hello Client Router - Zebra');
				assertBodyIncludes(html, '/route-premises/');
			});

			await it(`props.json endpoint — ${item}`, async () => {
				const res = await get(address, '/route-premises/__index.props.json', {
					trailingSlash: false,
				});
				assertStatus(res, 200);
				const body = await res.text();
				// Should be valid JSON containing the handler's return value
				const json = JSON.parse(body);
				assert.equal(json.title, 'Hello Client Router - Zebra');
			});

			await it(`doc.html endpoint — ${item}`, async () => {
				const res = await get(address, '/route-premises/__index.doc.html', {
					trailingSlash: false,
				});
				assertStatus(res, 200);
				const body = await res.text();
				assertBodyIncludes(body, '<html');
			});
		});

		await it(`homepage with query param — ${item}`, async () => {
			const html = await getText(address, '/?q=123');
			assertBodyIncludes(html, 'QUERY:');
			assertBodyIncludes(html, '123');
		});

		await it(`assets methods page — ${item}`, async () => {
			const html = await getText(address, '/assets-methods');
			assertBodyIncludes(html, 'my-el');
		});

		await it(`response init GET — ${item}`, async () => {
			const res = await get(address, '/response-init', {
				headers: { hey: '__abc' },
			});
			assertStatus(res, 210);
			assertHeader(res, 'bar', 'baz');
			assertHeader(res, 'daz', 'doze');
		});

		await it(`response init POST — ${item}`, async () => {
			const res = await get(address, '/response-init', {
				method: 'POST',
				headers: { hey: '__oi' },
			});
			assertStatus(res, 211);
			assertHeader(res, 'azz', 'ozz');
			assertHeader(res, 'dizz', 'duzz');
		});

		await it(`error page when route throws — ${item}`, async () => {
			const html = await getText(address, '/throws');
			assertBodyIncludes(html, '500');
		});

		await it(`redirect — ${item}`, async () => {
			const res = await get(address, '/redirect');
			assertRedirected(res, '/about/');
		});

		// Template failure test — Express only (Hono doesn't handle stream
		// abort as gracefully).
		if (item === 'express') {
			await it(`template failure recovery — ${item}`, async () => {
				const html = await getText(address, '/template-failure');
				assertBodyIncludes(html, 'FAILING-1');
				assertBodyIncludes(html, 'FAILING-9');
			});
		}

		// Run API tests
		await api(address, item);
	});
}
