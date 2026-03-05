/**
 * Islands addon — SSR smoke test (static-site-islands dev server).
 *
 * Verifies that `<is-land>` elements with React, Vue, Svelte, Solid and
 * Preact components are server-side rendered by the custom ElementRenderer.
 *
 * No browser / hydration tests here, just structural HTML assertions on
 * the SSR output from the Vite dev server.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { after, before, describe, it } from 'node:test';

import { getText } from '../helpers/fetch.js';
import {
	assertBodyIncludes,
	assertExists,
	assertH1,
	assertTitle,
	parseHtml,
} from '../helpers/html.js';
import { createTestServer, type TestServer } from '../helpers/server.js';

describe('Islands addon — SSR smoke (static-site-islands)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('static-site-islands');
		// The gracileIslands() plugin loads the island registry via
		// queueMicrotask + ssrLoadModule after the server starts.
		// Give it time to settle before making requests.
		await new Promise((r) => setTimeout(r, 3000));
	});

	after(async () => {
		await server?.close();
	});

	// ── Page-level structure ─────────────────────────────────────────

	it('renders the page with correct title and heading', async () => {
		const html = await getText(server.address, '/');
		const $ = parseHtml(html);

		assertTitle($, 'Document - Islands - All Islands');
		assertH1($, 'Hello Islands');
	});

	// ── <is-land> elements present ───────────────────────────────────

	it('contains an <is-land> element for every framework', async () => {
		const html = await getText(server.address, '/');
		const $ = parseHtml(html);

		assertExists($, '#react-island is-land[load="CounterReact"]');
		assertExists($, '#vue-island is-land[load="CounterVue"]');
		assertExists($, '#svelte-island is-land[load="CounterSvelte"]');
		assertExists($, '#solid-island is-land[load="CounterSolid"]');
		assertExists($, '#preact-island is-land[load="CounterPreact"]');
	});

	// ── Framework SSR output ─────────────────────────────────────────

	it('SSR-renders the React island', async () => {
		const html = await getText(server.address, '/');

		assertBodyIncludes(html, 'React SSR OK');
		assertBodyIncludes(html, 'data-island="react"');
	});

	it('SSR-renders the Vue island', async () => {
		const html = await getText(server.address, '/');

		assertBodyIncludes(html, 'Vue SSR OK');
		assertBodyIncludes(html, 'data-island="vue"');
	});

	it('SSR-renders the Svelte island', async () => {
		const html = await getText(server.address, '/');

		assertBodyIncludes(html, 'Svelte SSR OK');
		assertBodyIncludes(html, 'data-island="svelte"');
	});

	it('SSR-renders the Solid island', async () => {
		const html = await getText(server.address, '/');

		assertBodyIncludes(html, 'Solid SSR OK');
		assertBodyIncludes(html, 'data-island="solid"');
	});

	it('SSR-renders the Preact island', async () => {
		const html = await getText(server.address, '/');

		assertBodyIncludes(html, 'Preact SSR OK');
		assertBodyIncludes(html, 'data-island="preact"');
	});
});
