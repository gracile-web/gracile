/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, it } from 'node:test';
import * as nodeAssert from 'node:assert/strict';

import {
	injectSiblingAssets,
	ensureDoctype,
	injectDevOverlay as injectDevelopmentOverlay,
	devOverlaySnippet as developmentOverlaySnippet,
	injectServerAssets,
	mergeRenderInfo,
	REGEX_TAG_SCRIPT,
	REGEX_TAG_LINK,
} from './route-template-pipeline.js';

// ── mergeRenderInfo ──────────────────────────────────────────────────

describe('mergeRenderInfo', () => {
	it('appends LitElementRenderer when no user renderers', () => {
		// eslint-disable-next-line unicorn/no-useless-undefined
		const result = mergeRenderInfo(undefined);
		nodeAssert.ok(Array.isArray(result.elementRenderers));
		nodeAssert.equal(result.elementRenderers!.length, 1);
	});

	it('preserves user renderers and appends LitElementRenderer', () => {
		// eslint-disable-next-line @typescript-eslint/no-extraneous-class
		const fakeRenderer = class {} as never;
		const result = mergeRenderInfo({
			elementRenderers: [fakeRenderer],
		});
		nodeAssert.equal(result.elementRenderers!.length, 2);
		nodeAssert.equal(result.elementRenderers![0], fakeRenderer);
	});

	it('spreads other RenderInfo properties through', () => {
		const result = mergeRenderInfo({
			deferHydration: true,
		} as never);
		nodeAssert.equal(
			(result as Record<string, unknown>)['deferHydration'],
			true,
		);
	});
});

// ── injectSiblingAssets ──────────────────────────────────────────────

describe('injectSiblingAssets', () => {
	const DOC = '<html><head><title>T</title></head><body></body></html>';

	it('does nothing when pageAssets is empty', () => {
		const result = injectSiblingAssets(DOC, []);
		// The marker is inserted then replaced with '', so only the \n remains.
		nodeAssert.ok(result.includes('</head>'));
		nodeAssert.ok(!result.includes('PAGE ASSETS'));
	});

	it('injects a <script> tag for .ts file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.ts']);
		nodeAssert.ok(
			result.includes(
				'<script type="module" src="/src/pages/home.ts"></script>',
			),
		);
		nodeAssert.ok(result.includes('<!-- PAGE ASSETS -->'));
		nodeAssert.ok(result.includes('<!-- /PAGE ASSETS -->'));
	});

	it('injects a <script> tag for .js file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.js']);
		nodeAssert.ok(
			result.includes(
				'<script type="module" src="/src/pages/home.js"></script>',
			),
		);
	});

	it('injects a <script> tag for .jsx file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.jsx']);
		nodeAssert.ok(result.includes('src="/src/pages/home.jsx"'));
	});

	it('injects a <script> tag for .tsx file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.tsx']);
		nodeAssert.ok(result.includes('src="/src/pages/home.tsx"'));
	});

	it('injects a <link> tag for .css file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.css']);
		nodeAssert.ok(
			result.includes('<link rel="stylesheet" href="/src/pages/home.css" />'),
		);
	});

	it('injects a <link> tag for .scss file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.scss']);
		nodeAssert.ok(result.includes('href="/src/pages/home.scss"'));
	});

	it('injects a <link> tag for .sass file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.sass']);
		nodeAssert.ok(result.includes('href="/src/pages/home.sass"'));
	});

	it('injects a <link> tag for .less file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.less']);
		nodeAssert.ok(result.includes('href="/src/pages/home.less"'));
	});

	it('injects a <link> tag for .styl file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.styl']);
		nodeAssert.ok(result.includes('href="/src/pages/home.styl"'));
	});

	it('injects a <link> tag for .stylus file', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.stylus']);
		nodeAssert.ok(result.includes('href="/src/pages/home.stylus"'));
	});

	it('handles multiple mixed assets', () => {
		const result = injectSiblingAssets(DOC, [
			'src/pages/home.ts',
			'src/pages/home.css',
		]);
		nodeAssert.ok(result.includes('<script type="module"'));
		nodeAssert.ok(result.includes('<link rel="stylesheet"'));
	});

	it('places assets before </head>', () => {
		const result = injectSiblingAssets(DOC, ['src/pages/home.ts']);
		const scriptIndex = result.indexOf('<script type="module"');
		const headCloseIndex = result.indexOf('</head>');
		nodeAssert.ok(scriptIndex < headCloseIndex);
	});
});

// ── ensureDoctype ────────────────────────────────────────────────────

describe('ensureDoctype', () => {
	it('prepends doctype when missing', () => {
		const result = ensureDoctype('<html><head></head></html>');
		nodeAssert.ok(result.startsWith('<!doctype html>\n<html>'));
	});

	it('leaves doctype unchanged when present (lowercase)', () => {
		const document_ = '<!doctype html>\n<html></html>';
		const result = ensureDoctype(document_);
		nodeAssert.equal(result, document_);
	});

	it('leaves doctype unchanged when present (uppercase)', () => {
		const document_ = '<!DOCTYPE html>\n<html></html>';
		const result = ensureDoctype(document_);
		nodeAssert.equal(result, document_);
	});

	it('handles leading whitespace before doctype', () => {
		const document_ = '  <!doctype html>\n<html></html>';
		const result = ensureDoctype(document_);
		// trimStart is used, so the doctype IS found — no prepend.
		nodeAssert.equal(result, document_);
	});

	it('handles leading whitespace without doctype', () => {
		const document_ = '  <html></html>';
		const result = ensureDoctype(document_);
		nodeAssert.ok(result.startsWith('<!doctype html>\n'));
	});

	it('handles empty string', () => {
		const result = ensureDoctype('');
		nodeAssert.equal(result, '<!doctype html>\n');
	});
});

// ── devOverlaySnippet ────────────────────────────────────────────────

describe('devOverlaySnippet', () => {
	it('returns a <script type="module"> tag', () => {
		const snippet = developmentOverlaySnippet();
		nodeAssert.ok(snippet.includes('<script type="module">'));
		nodeAssert.ok(snippet.includes('</script>'));
	});

	it('contains import.meta.hot listeners', () => {
		const snippet = developmentOverlaySnippet();
		nodeAssert.ok(snippet.includes('import.meta.hot'));
		nodeAssert.ok(snippet.includes('gracile:ssr-error'));
	});
});

// ── injectDevOverlay ─────────────────────────────────────────────────

describe('injectDevOverlay', () => {
	const DOC = '<!doctype html>\n<html><head><title>T</title></head></html>';

	it('injects the overlay right after <head>', () => {
		const result = injectDevelopmentOverlay(DOC);
		const headIndex = result.indexOf('<head>');
		const scriptIndex = result.indexOf('<script type="module">');
		nodeAssert.ok(scriptIndex > headIndex);
		// The script should come before </head>
		const headCloseIndex = result.indexOf('</head>');
		nodeAssert.ok(scriptIndex < headCloseIndex);
	});

	it('preserves the rest of the document', () => {
		const result = injectDevelopmentOverlay(DOC);
		nodeAssert.ok(result.includes('<title>T</title>'));
		nodeAssert.ok(result.includes('</html>'));
	});
});

// ── injectServerAssets ───────────────────────────────────────────────

describe('injectServerAssets', () => {
	it('strips <script type="module"> tags', () => {
		const document_ =
			'<html><head><script type="module" src="/src/app.js"></script></head></html>';
		const result = injectServerAssets(
			document_,
			'<link rel="stylesheet" href="/assets/style.css">',
		);
		nodeAssert.ok(!result.includes('src="/src/app.js"'));
	});

	it('preserves non-module script tags', () => {
		const document_ =
			'<html><head><script>console.log("hi")</script></head></html>';
		const result = injectServerAssets(
			document_,
			'<link rel="stylesheet" href="/x.css">',
		);
		nodeAssert.ok(result.includes('console.log("hi")'));
	});

	it('strips <link rel="stylesheet"> tags', () => {
		const document_ =
			'<html><head><link rel="stylesheet" href="/src/style.css"></head></html>';
		const result = injectServerAssets(
			document_,
			'<script type="module" src="/assets/app.js"></script>',
		);
		nodeAssert.ok(!result.includes('href="/src/style.css"'));
	});

	it('preserves non-stylesheet link tags', () => {
		const document_ =
			'<html><head><link rel="icon" href="/favicon.ico"></head></html>';
		const result = injectServerAssets(
			document_,
			'<script src="/x.js"></script>',
		);
		nodeAssert.ok(result.includes('rel="icon"'));
	});

	it('injects route assets before </head>', () => {
		const document_ = '<html><head><title>T</title></head></html>';
		const assets = '<link rel="stylesheet" href="/assets/style.css">';
		const result = injectServerAssets(document_, assets);
		const assetsIndex = result.indexOf(assets);
		const headCloseIndex = result.indexOf('</head>');
		nodeAssert.ok(assetsIndex < headCloseIndex);
		nodeAssert.ok(assetsIndex > 0);
	});

	it('handles multiple script and link tags', () => {
		const document_ =
			'<html><head>' +
			'<script type="module" src="/a.js"></script>' +
			'<script>inline()</script>' +
			'<link rel="stylesheet" href="/a.css">' +
			'<link rel="icon" href="/favicon.ico">' +
			'</head></html>';
		const result = injectServerAssets(document_, '<link href="/prod.css">');
		nodeAssert.ok(!result.includes('src="/a.js"'));
		nodeAssert.ok(result.includes('inline()'));
		nodeAssert.ok(!result.includes('href="/a.css"'));
		nodeAssert.ok(result.includes('rel="icon"'));
		nodeAssert.ok(result.includes('href="/prod.css"'));
	});
});

// ── REGEX_TAG_SCRIPT ─────────────────────────────────────────────────

describe('REGEX_TAG_SCRIPT', () => {
	it('matches a basic script tag', () => {
		REGEX_TAG_SCRIPT.lastIndex = 0;
		nodeAssert.ok(REGEX_TAG_SCRIPT.test('<script>x</script>'));
	});

	it('matches a script with attributes', () => {
		REGEX_TAG_SCRIPT.lastIndex = 0;
		nodeAssert.ok(
			REGEX_TAG_SCRIPT.test('<script type="module" src="/app.js"></script>'),
		);
	});

	it('does not match a lone opening tag', () => {
		REGEX_TAG_SCRIPT.lastIndex = 0;
		nodeAssert.ok(!REGEX_TAG_SCRIPT.test('<script src="/app.js">'));
	});
});

// ── REGEX_TAG_LINK ───────────────────────────────────────────────────

describe('REGEX_TAG_LINK', () => {
	it('matches a link tag', () => {
		REGEX_TAG_LINK.lastIndex = 0;
		nodeAssert.ok(REGEX_TAG_LINK.test('<link rel="stylesheet" href="/s.css">'));
	});

	it('matches a self-closing link tag', () => {
		REGEX_TAG_LINK.lastIndex = 0;
		nodeAssert.ok(REGEX_TAG_LINK.test('<link rel="icon" href="/f.ico" />'));
	});

	it('does not match a script tag', () => {
		REGEX_TAG_LINK.lastIndex = 0;
		nodeAssert.ok(!REGEX_TAG_LINK.test('<script></script>'));
	});
});
