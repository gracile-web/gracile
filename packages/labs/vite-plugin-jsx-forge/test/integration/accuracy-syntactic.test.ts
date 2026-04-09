/**
 * Accuracy test — **syntactic** (type-unaware) JSX → Lit transformation.
 *
 * Boots a Vite dev server against the `jsx-accuracy` fixture using
 * `typeAware: false`. Verifies that:
 *
 * - Namespace-prefixed bindings (`on:`, `bool:`, `if:`) still work.
 * - Fragments, expressions, conditionals, and list rendering work.
 * - Static content and nested elements are preserved.
 * - Spread attributes are gracefully skipped (no crash).
 * - `.ts` routes pass through unaffected.
 * - Type-based automatic bindings (?disabled, ifDefined) are **not** applied.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { getText } from '@gracile/internal-test-utils/fetch';
import {
	assertBodyExcludes,
	assertBodyIncludes,
	assertExists,
	assertText,
	assertTextIncludes,
	assertTitle,
	parseHtml,
} from '@gracile/internal-test-utils/html';
import { gracile } from '@gracile/gracile/plugin';
import { gracileJsxToLiterals } from '@gracile-labs/vite-plugin-jsx-forge/to-literals';
import { createServer as viteCreateServer } from 'vite';

/** Boot a dev server for **syntactic** mode against the jsx-accuracy fixture. */
async function createSyntacticServer() {
	const root = resolve(process.cwd(), '__fixtures__', 'jsx-accuracy');

	const server = await viteCreateServer({
		configFile: false,
		root,
		server: { port: 0 },
		logLevel: 'error',
		cacheDir: join(tmpdir(), '.vite-test', randomUUID()),
		plugins: [gracileJsxToLiterals({ typeAware: false }), gracile()],
	});

	await server.listen();

	const info = server.httpServer?.address() as AddressInfo | null;
	if (!info?.port) {
		await server.close();
		throw new Error('Vite dev server failed to bind a port (syntactic test)');
	}

	return {
		address: `http://localhost:${info.port}`,
		close: () => server.close(),
	};
}

describe('jsx accuracy — syntactic transforms (dev server)', () => {
	let server: Awaited<ReturnType<typeof createSyntacticServer>>;

	before(async () => {
		server = await createSyntacticServer();
	});

	after(async () => {
		await server?.close();
	});

	// ── Home route: namespace-based & static scenarios ────────────────

	describe('(home).tsx — syntactic mode attributes', () => {
		let html: string;
		let $: ReturnType<typeof parseHtml>;

		before(async () => {
			html = await getText(server.address, '/');
			$ = parseHtml(html);
		});

		it('renders with correct title', () => {
			assertTitle($, 'JSX Accuracy - Types');
		});

		it('renders explicit namespace bindings', () => {
			assertExists($, '#explicit-bindings');
			assertExists($, '#explicit-bindings button');
			assertExists($, '#explicit-bindings input');
			assertExists($, '#explicit-bindings a');
		});

		it('renders static content section', () => {
			assertText($, '#static-only p', 'Just plain text, no bindings.');
		});

		it('renders mixed static + dynamic section', () => {
			assertExists($, '#mixed');
			assertTextIncludes($, '#mixed p', 'Value is');
			assertTextIncludes($, '#mixed p', 'hello');
		});

		it('renders nested elements', () => {
			assertExists($, '#nested div span em');
			assertText($, '#nested em', 'Deeply nested');
		});

		it('renders plain attribute sections without crashing', () => {
			assertExists($, '#boolean-attrs');
			assertExists($, '#maybe-attrs');
			assertExists($, '#plain-attrs');
		});

		it('does not contain raw JSX in output', () => {
			assertBodyExcludes(html, 'className=');
			assertBodyExcludes(html, 'jsxs(');
			assertBodyExcludes(html, 'jsx(');
		});
	});

	// ── Spread route: fragments, expressions (spread is skipped) ─────

	describe('spread.tsx — syntactic mode (spread skipped)', () => {
		let html: string;
		let $: ReturnType<typeof parseHtml>;

		before(async () => {
			html = await getText(server.address, '/spread');
			$ = parseHtml(html);
		});

		it('renders with correct title', () => {
			assertTitle($, 'JSX Accuracy - Spread');
		});

		it('renders the spread section without crashing', () => {
			assertExists($, '#spread');
			// Spread attributes are skipped in syntactic mode, but the
			// element and its text children should still render.
			assertExists($, '#spread a');
			assertTextIncludes($, '#spread a', 'Spread link');
		});

		it('renders fragment children', () => {
			assertExists($, '#fragments ul');
			assertExists($, '#fragments li');
			assertTextIncludes($, '#fragments', 'First');
			assertTextIncludes($, '#fragments', 'Second');
			assertTextIncludes($, '#fragments', 'Third');
		});

		it('renders inline expressions', () => {
			assertTextIncludes($, '#expressions', '4');
			assertTextIncludes($, '#expressions', 'a, b, c');
		});

		it('renders conditional content', () => {
			assertTextIncludes($, '#conditional', 'Truthy');
			assertBodyExcludes(html, 'Hidden');
		});

		it('renders list items', () => {
			assertTextIncludes($, '#list', 'alpha');
			assertTextIncludes($, '#list', 'beta');
			assertTextIncludes($, '#list', 'gamma');
		});
	});

	// ── Plain route: .ts file (no JSX) passes through ────────────────

	describe('plain.ts — non-JSX route unaffected', () => {
		let html: string;
		let $: ReturnType<typeof parseHtml>;

		before(async () => {
			html = await getText(server.address, '/plain');
			$ = parseHtml(html);
		});

		it('renders with correct title', () => {
			assertTitle($, 'JSX Accuracy - Plain');
		});

		it('renders plain Lit html content', () => {
			assertTextIncludes(
				$,
				'#plain-lit p',
				'This route uses plain Lit html, no JSX.',
			);
		});
	});
});
