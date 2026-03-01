/**
 * API route tests for server-mode (shared between Express and Hono).
 *
 * Uses direct JSON/status assertions instead of snapshot comparison.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { it } from 'node:test';

import { get } from '../helpers/fetch.js';
import { assertHeader, assertStatus } from '../helpers/html.js';

export async function api(address: string, item: string) {
	const API = '/api';

	for (const method of ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'QUERY']) {
		// eslint-disable-next-line no-await-in-loop
		await it(`API ${method} — ${item}`, async () => {
			const hasBody = !['GET', 'HEAD', 'DELETE'].includes(method);
			const body = { [method]: Math.random() };
			const url = new URL(`${API}/basic/`, address);
			url.searchParams.set('foo', 'bar');

			const res = await fetch(url, {
				method,
				body: hasBody ? JSON.stringify(body) : null,
			});

			assertStatus(res, 200);
			assertHeader(res, 'bar', 'baz');

			const json = (await res.json()) as Record<string, unknown>;
			assert.equal(json[method], 'ok');
			assert.equal(json.param1, 'bar');

			if (hasBody) {
				assert.deepEqual(json.body, body);
			}

			// Check locals are passed through
			const locals = json.locals as { requestIdLength: number } | undefined;
			assert.equal(locals?.requestIdLength, 36);
		});
	}

	await it(`API POST with form data — ${item}`, async () => {
		const url = new URL(`${API}/basic/`, address);
		url.searchParams.set('form', 'true');

		const body = new FormData();
		body.set('bar', 'baz');
		body.set('doz', 'diz');

		const res = await fetch(url, { method: 'POST', body });

		assertStatus(res, 200);
		const json = (await res.json()) as Record<string, unknown>;
		assert.deepEqual(json.formData, { bar: 'baz', doz: 'diz' });
	});
}
