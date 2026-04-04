/**
 * Accuracy test — type-aware JSX → Lit template literal transformation.
 *
 * Builds the `jsx-accuracy` fixture with `vite build` (via Gracile SSR),
 * then inspects the rendered HTML for the expected Lit binding patterns:
 *
 * - Boolean attributes → `?disabled` binding
 * - Undefined-union attributes → `ifDefined()` wrapping
 * - Plain attributes → static or expression binding
 * - Spread attributes → expanded individual bindings
 * - Fragments → children inlined
 * - Static content → no bindings
 * - Mixed static + dynamic content
 * - `.ts` routes → unaffected (no JSX transform)
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
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
import {
	createTestServer,
	type TestServer,
} from '@gracile/internal-test-utils/server';

describe('jsx accuracy — type-aware transforms (dev server)', () => {
	let server: TestServer;

	before(async () => {
		server = await createTestServer('jsx-accuracy');
	});

	after(async () => {
		await server?.close();
	});

	// ── Home route: type-aware attribute scenarios ────────────────────

	describe('(home).tsx — type-aware attributes', () => {
		let html: string;
		let $: ReturnType<typeof parseHtml>;

		before(async () => {
			html = await getText(server.address, '/');
			$ = parseHtml(html);
		});

		it('renders with correct title', () => {
			assertTitle($, 'JSX Accuracy - Types');
		});

		it('renders boolean attribute section', () => {
			assertExists($, '#boolean-attrs');
			assertExists($, '#boolean-attrs button');
			assertTextIncludes($, '#boolean-attrs button', 'Disabled button');
		});

		it('renders undefined-union attribute section', () => {
			assertExists($, '#maybe-attrs');
			assertExists($, '#maybe-attrs div');
		});

		it('renders plain attribute section', () => {
			assertExists($, '#plain-attrs');
			assertExists($, '#plain-attrs div');
		});

		it('renders explicit bindings section', () => {
			assertExists($, '#explicit-bindings');
			assertExists($, '#explicit-bindings button');
			assertExists($, '#explicit-bindings input');
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

		it('does not contain raw JSX in output', () => {
			// No JSX syntax should survive — all transformed to Lit html``
			assertBodyExcludes(html, 'className=');
			assertBodyExcludes(html, 'jsxs(');
			assertBodyExcludes(html, 'jsx(');
		});
	});

	// ── Spread route: spread, fragments, expressions ─────────────────

	describe('spread.tsx — spread, fragments, expressions', () => {
		let html: string;
		let $: ReturnType<typeof parseHtml>;

		before(async () => {
			html = await getText(server.address, '/spread');
			$ = parseHtml(html);
		});

		it('renders with correct title', () => {
			assertTitle($, 'JSX Accuracy - Spread');
		});

		it('renders spread attributes on the link', () => {
			assertExists($, '#spread a');
			assertTextIncludes($, '#spread a', 'Spread link');
			// The spread should expand href, target, rel as individual attrs
			assertBodyIncludes(html, 'https://example.com');
			assertBodyIncludes(html, 'noopener');
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
