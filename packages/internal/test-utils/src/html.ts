/**
 * Cheerio-based HTML structural assertions.
 *
 * Instead of comparing entire HTML documents byte-for-byte, these helpers
 * verify _structure_: the right elements exist, contain the expected text,
 * have the expected attributes, etc.  This makes tests resilient to Vite
 * version bumps, Lit hydration comment changes, hash changes, and formatting.
 */

import assert from 'node:assert/strict';

import * as cheerio from 'cheerio';

export type Document_ = cheerio.CheerioAPI;

// ── Parsing ──────────────────────────────────────────────────────────

/** Parse an HTML string into a Cheerio document. */
export function parseHtml(html: string): Document_ {
	return cheerio.load(html);
}

// ── Element assertions ───────────────────────────────────────────────

/** Assert the text content of `<title>`. */
export function assertTitle($: Document_, expected: string) {
	assert.equal($('title').text().trim(), expected, `<title> mismatch`);
}

/** Assert `<title>` text includes a substring. */
export function assertTitleIncludes($: Document_, substring: string) {
	const title = $('title').text().trim();
	assert.ok(
		title.includes(substring),
		`Expected <title> "${title}" to include "${substring}"`,
	);
}

/** Assert the text of the first `<h1>`. */
export function assertH1($: Document_, expected: string) {
	assert.equal($('h1').first().text().trim(), expected, `<h1> mismatch`);
}

/** Assert the trimmed text of the first element matching `selector`. */
export function assertText($: Document_, selector: string, expected: string) {
	const actual = $(selector).first().text().trim();
	assert.equal(actual, expected, `"${selector}" text mismatch`);
}

/** Assert at least one element matching `selector` exists. */
export function assertExists($: Document_, selector: string) {
	assert.ok(
		$(selector).length > 0,
		`Expected to find "${selector}" in the document`,
	);
}

/** Assert the text of `selector` includes a substring. */
export function assertTextIncludes(
	$: Document_,
	selector: string,
	substring: string,
) {
	const text = $(selector).first().text();
	assert.ok(
		text.includes(substring),
		`Expected "${selector}" text to include "${substring}", got "${text}"`,
	);
}

/** Assert the raw HTML string includes a substring. */
export function assertBodyIncludes(html: string, substring: string) {
	assert.ok(
		html.includes(substring),
		`Expected HTML body to include "${substring}"`,
	);
}

/** Assert the raw HTML string does NOT include a substring. */
export function assertBodyExcludes(html: string, substring: string) {
	assert.ok(
		!html.includes(substring),
		`Expected HTML body NOT to include "${substring}"`,
	);
}

/** Assert an attribute value on the first element matching `selector`. */
export function assertAttribute(
	$: Document_,
	selector: string,
	attribute: string,
	expected: string,
) {
	const actual = $(selector).first().attr(attribute);
	assert.equal(actual, expected, `"${selector}" attr "${attribute}" mismatch`);
}

// ── Response assertions ──────────────────────────────────────────────

/** Assert HTTP status code. */
export function assertStatus(response: Response, expected: number) {
	assert.equal(
		response.status,
		expected,
		`Expected status ${expected}, got ${response.status}`,
	);
}

/** Assert Content-Type header starts with expected MIME. */
export function assertContentType(response: Response, expected: string) {
	const actual = response.headers.get('Content-Type') ?? '';
	assert.ok(
		actual.startsWith(expected),
		`Expected Content-Type to start with "${expected}", got "${actual}"`,
	);
}

/** Assert a response header has the expected value. */
export function assertHeader(
	response: Response,
	name: string,
	expected: string,
) {
	assert.equal(
		response.headers.get(name),
		expected,
		`Header "${name}" mismatch`,
	);
}

/** Assert the response was redirected. */
export function assertRedirected(response: Response, expectedUrl?: string) {
	assert.equal(response.redirected, true, 'Expected response to be redirected');
	if (expectedUrl) {
		assert.ok(
			response.url.includes(expectedUrl),
			`Expected redirect URL to include "${expectedUrl}", got "${response.url}"`,
		);
	}
}
