/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, it } from 'node:test';
import * as nodeAssert from 'node:assert/strict';

import type { GracileConfig } from '../../user-config.js';

import {
	rewriteHiddenRoutes,
	resolvePremises,
	isRedirect,
	CONTENT_TYPE_HTML,
	PREMISE_REGEXES,
} from '../../server/request-pipeline.js';

// ── helpers ──────────────────────────────────────────────────────────

/** Build a minimal GracileConfig with premises expose toggled. */
function configWith(expose: boolean): GracileConfig {
	return { pages: { premises: { expose } } } as GracileConfig;
}

const CONFIG_ENABLED = configWith(true);
const CONFIG_DISABLED = configWith(false);
const CONFIG_EMPTY = {} as GracileConfig;

// ── rewriteHiddenRoutes ──────────────────────────────────────────────

describe('rewriteHiddenRoutes', () => {
	it('strips the /__… suffix for props JSON', () => {
		const url = 'http://localhost:3000/blog/__index.props.json';
		nodeAssert.equal(rewriteHiddenRoutes(url), 'http://localhost:3000/blog/');
	});

	it('strips the /__… suffix for doc HTML', () => {
		const url = 'http://localhost:3000/about/__about.doc.html';
		nodeAssert.equal(rewriteHiddenRoutes(url), 'http://localhost:3000/about/');
	});

	it('returns the URL unchanged when there is no /__… suffix', () => {
		const url = 'http://localhost:3000/about/';
		nodeAssert.equal(rewriteHiddenRoutes(url), url);
	});

	it('handles root-level premise URLs', () => {
		const url = 'http://localhost:3000/__index.props.json';
		nodeAssert.equal(rewriteHiddenRoutes(url), 'http://localhost:3000/');
	});

	it('handles nested premises with extra path segments', () => {
		const url = 'http://localhost:3000/a/b/c/__deep.doc.html';
		nodeAssert.equal(rewriteHiddenRoutes(url), 'http://localhost:3000/a/b/c/');
	});

	it('leaves URLs with underscores but not double-underscore prefix alone', () => {
		// e.g. /my_page/ should NOT be rewritten
		const url = 'http://localhost:3000/my_page/';
		nodeAssert.equal(rewriteHiddenRoutes(url), url);
	});
});

// ── resolvePremises ──────────────────────────────────────────────────

describe('resolvePremises — enabled', () => {
	it('returns { propertiesOnly: true } for .props.json URL', () => {
		const url = 'http://localhost:3000/blog/__index.props.json';
		const result = resolvePremises(url, CONFIG_ENABLED);
		nodeAssert.deepEqual(result, { propertiesOnly: true, documentOnly: false });
	});

	it('returns { documentOnly: true } for .doc.html URL', () => {
		const url = 'http://localhost:3000/about/__about.doc.html';
		const result = resolvePremises(url, CONFIG_ENABLED);
		nodeAssert.deepEqual(result, { propertiesOnly: false, documentOnly: true });
	});

	it('returns both false for a normal URL', () => {
		const url = 'http://localhost:3000/about/';
		const result = resolvePremises(url, CONFIG_ENABLED);
		nodeAssert.deepEqual(result, {
			propertiesOnly: false,
			documentOnly: false,
		});
	});
});

describe('resolvePremises — disabled', () => {
	it('throws when hitting a premise URL with premises disabled', () => {
		const url = 'http://localhost:3000/blog/__index.props.json';
		nodeAssert.throws(
			() => resolvePremises(url, CONFIG_DISABLED),
			/premise.*not activated/i,
		);
	});

	it('throws for .doc.html URL when disabled', () => {
		const url = 'http://localhost:3000/about/__about.doc.html';
		nodeAssert.throws(
			() => resolvePremises(url, CONFIG_DISABLED),
			/premise.*not activated/i,
		);
	});

	it('returns null for normal URL when disabled', () => {
		const result = resolvePremises('http://localhost:3000/', CONFIG_DISABLED);
		nodeAssert.equal(result, null);
	});
});

describe('resolvePremises — empty config', () => {
	it('returns null for normal URL with empty config', () => {
		const result = resolvePremises('http://localhost:3000/', CONFIG_EMPTY);
		nodeAssert.equal(result, null);
	});

	it('throws for premise URL with empty config (expose not set)', () => {
		const url = 'http://localhost:3000/blog/__index.props.json';
		nodeAssert.throws(
			() => resolvePremises(url, CONFIG_EMPTY),
			/premise.*not activated/i,
		);
	});
});

// ── isRedirect ───────────────────────────────────────────────────────

describe('isRedirect', () => {
	it('returns { location } for 301 with a location header', () => {
		const response = new Response(null, {
			status: 301,
			headers: { Location: '/new-place' },
		});
		nodeAssert.deepEqual(isRedirect(response), { location: '/new-place' });
	});

	it('returns { location } for 302', () => {
		const response = new Response(null, {
			status: 302,
			headers: { Location: '/other' },
		});
		nodeAssert.deepEqual(isRedirect(response), { location: '/other' });
	});

	it('returns { location } for 303', () => {
		const response = new Response(null, {
			status: 303,
			headers: { Location: '/see-other' },
		});
		nodeAssert.deepEqual(isRedirect(response), { location: '/see-other' });
	});

	it('returns null for 200 even with a location header', () => {
		const response = new Response(null, {
			status: 200,
			headers: { Location: '/not-redirect' },
		});
		nodeAssert.equal(isRedirect(response), null);
	});

	it('returns null for 301 without a location header', () => {
		const response = new Response(null, { status: 301 });
		nodeAssert.equal(isRedirect(response), null);
	});

	it('returns null for 304 (Not Modified — above the 303 threshold)', () => {
		const response = new Response(null, {
			status: 304,
			headers: { Location: '/somewhere' },
		});
		nodeAssert.equal(isRedirect(response), null);
	});

	it('returns { location } for 300 (Multiple Choices)', () => {
		const response = new Response(null, {
			status: 300,
			headers: { Location: '/choices' },
		});
		nodeAssert.deepEqual(isRedirect(response), { location: '/choices' });
	});
});

// ── CONTENT_TYPE_HTML ────────────────────────────────────────────────

describe('CONTENT_TYPE_HTML', () => {
	it('contains the correct Content-Type header value', () => {
		nodeAssert.equal(CONTENT_TYPE_HTML['Content-Type'], 'text/html');
	});
});

// ── PREMISE_REGEXES ──────────────────────────────────────────────────

describe('PREMISE_REGEXES', () => {
	it('properties regex matches __index.props.json', () => {
		nodeAssert.ok(PREMISE_REGEXES.properties.test('/__index.props.json'));
	});

	it('properties regex matches nested path', () => {
		nodeAssert.ok(PREMISE_REGEXES.properties.test('/blog/__slug.props.json'));
	});

	it('properties regex does not match doc HTML', () => {
		nodeAssert.ok(!PREMISE_REGEXES.properties.test('/__index.doc.html'));
	});

	it('document regex matches __index.doc.html', () => {
		nodeAssert.ok(PREMISE_REGEXES.document.test('/__index.doc.html'));
	});

	it('document regex does not match props JSON', () => {
		nodeAssert.ok(!PREMISE_REGEXES.document.test('/__index.props.json'));
	});

	it('neither regex matches a normal URL', () => {
		nodeAssert.ok(!PREMISE_REGEXES.properties.test('/about/'));
		nodeAssert.ok(!PREMISE_REGEXES.document.test('/about/'));
	});
});
