import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import type { ImportDeclaration } from '@oxc-project/types';
import { build, type Rollup } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

import {
	buildReplacement,
	findCssImports,
	getCssAttributeType,
	resolveParser,
	standardCssModules,
	type Options,
} from '../index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Resolve back to src/test/fixtures regardless of whether we run from src/ or dist/
const FIXTURES = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../../src/test/fixtures',
);

const parseSync = await resolveParser();

/** Parse source and return ImportDeclaration nodes. */
function parseImports(code: string) {
	const { program } = parseSync('test.ts', code);
	return program.body.filter(
		(n): n is ImportDeclaration => n.type === 'ImportDeclaration',
	);
}

/**
 * Run vite.build on a fixture entry file and return the generated code.
 * This exercises the full plugin pipeline (resolve → transform).
 */
async function buildFixture(
	entryFile: string,
	options?: { ssr?: boolean; pluginOptions?: Options },
): Promise<string> {
	const entry = path.resolve(FIXTURES, entryFile);

	const result = await build({
		root: FIXTURES,
		logLevel: 'silent',
		plugins: [standardCssModules(options?.pluginOptions)],
		build: {
			write: false,
			...(options?.ssr
				? { ssr: entry, rollupOptions: { input: entry } }
				: { lib: { entry, formats: ['es'] } }),
		},
	});

	const output = Array.isArray(result) ? result[0] : result;
	const chunk =
		'output' in output! ? (output as Rollup.RollupOutput).output[0] : undefined;
	return chunk?.type === 'chunk' ? chunk.code : '';
}

// -----------------------------------------------------------------------------
// Unit tests — pure helpers
// -----------------------------------------------------------------------------

describe('getCssAttributeType', () => {
	it('returns "css" for type: "css"', () => {
		const [node] = parseImports(
			`import s from './a.css' with { type: 'css' };`,
		);
		assert.equal(getCssAttributeType(node!.attributes), 'css');
	});

	it('returns "css-lit" for type: "css-lit"', () => {
		const [node] = parseImports(
			`import s from './a.css' with { type: 'css-lit' };`,
		);
		assert.equal(getCssAttributeType(node!.attributes), 'css-lit');
	});

	it('returns null for type: "json"', () => {
		const [node] = parseImports(
			`import d from './data.json' with { type: 'json' };`,
		);
		assert.equal(getCssAttributeType(node!.attributes), null);
	});

	it('returns null when no attributes', () => {
		const [node] = parseImports(`import s from './a.css';`);
		assert.equal(getCssAttributeType(node!.attributes), null);
	});
});

describe('findCssImports', () => {
	it('finds a single CSS import', () => {
		const code = `import s from './a.css' with { type: 'css' };`;
		const imports = parseImports(code);
		const matches = findCssImports(imports);
		assert.equal(matches.length, 1);
		assert.equal(matches[0]!.type, 'css');
	});

	it('finds multiple CSS imports', () => {
		const code = [
			`import a from './a.css' with { type: 'css' };`,
			`import b from './b.scss' with { type: 'css-lit' };`,
		].join('\n');
		const matches = findCssImports(parseImports(code));
		assert.equal(matches.length, 2);
		assert.equal(matches[0]!.type, 'css');
		assert.equal(matches[1]!.type, 'css-lit');
	});

	it('ignores non-CSS imports with attributes', () => {
		const code = `import d from './data.json' with { type: 'json' };`;
		const matches = findCssImports(parseImports(code));
		assert.equal(matches.length, 0);
	});

	it('ignores CSS imports without with { type }', () => {
		const code = `import s from './a.css';`;
		const matches = findCssImports(parseImports(code));
		assert.equal(matches.length, 0);
	});

	it('recognises all CSS-like extensions', () => {
		const exts = [
			'css',
			'scss',
			'sass',
			'less',
			'styl',
			'stylus',
			'pcss',
			'sss',
		];
		const code = exts
			.map((e, i) => `import s${i} from './f.${e}' with { type: 'css' };`)
			.join('\n');
		const matches = findCssImports(parseImports(code));
		assert.equal(matches.length, exts.length);
	});
});

describe('buildReplacement', () => {
	it('generates CSSStyleSheet code for client', () => {
		const out = buildReplacement('styles', './a.css?inline', false);
		assert.ok(out.includes('new CSSStyleSheet()'));
		assert.ok(out.includes('replaceSync'));
		assert.ok(out.includes('from "./a.css?inline"'));
		assert.ok(out.includes('const styles ='));
		assert.ok(!out.includes('unsafeCSS'));
	});

	it('generates unsafeCSS code for Lit / SSR', () => {
		const out = buildReplacement('styles', './a.css?inline', true);
		assert.ok(out.includes('unsafeCSS'));
		assert.ok(out.includes("from 'lit'"));
		assert.ok(out.includes('from "./a.css?inline"'));
		assert.ok(out.includes('const styles ='));
		assert.ok(!out.includes('CSSStyleSheet'));
	});

	it('uses unique identifiers per localName', () => {
		const out = buildReplacement('myStyles', './x.css?inline', true);
		assert.ok(out.includes('__unsafeCSS_myStyles'));
		assert.ok(out.includes('__raw_myStyles'));
	});
});

// -----------------------------------------------------------------------------
// Integration tests — full Vite pipeline
// -----------------------------------------------------------------------------

describe('standardCssModules plugin (vite.build)', () => {
	it('transforms type: "css" to CSSStyleSheet in client mode', async () => {
		const code = await buildFixture('entry-css.ts');
		assert.ok(code.includes('new CSSStyleSheet'));
		assert.ok(code.includes('replaceSync'));
		assert.ok(code.includes('color:red'));
	});

	it('transforms type: "css" to unsafeCSS in SSR mode', async () => {
		const code = await buildFixture('entry-css.ts', { ssr: true });
		assert.ok(code.includes('unsafeCSS'));
		assert.ok(!code.includes('CSSStyleSheet'));
		assert.ok(code.includes('color:red'));
	});

	it('transforms type: "css-lit" to unsafeCSS in client mode', async () => {
		const code = await buildFixture('entry-css-lit.ts');
		assert.ok(code.includes('unsafeCSS'));
		assert.ok(code.includes('color:red'));
		// Our plugin should NOT emit the CSSStyleSheet wrapper pattern
		assert.ok(!code.includes('__sheet_'));
	});

	it('leaves files without CSS import attributes untouched', async () => {
		const code = await buildFixture('entry-no-css.ts');
		assert.ok(!code.includes('CSSStyleSheet'));
		assert.ok(!code.includes('unsafeCSS'));
		assert.ok(code.includes('hello world'));
	});

	it('handles multiple CSS imports in one file', async () => {
		const code = await buildFixture('entry-multi.ts');
		assert.ok(code.includes('CSSStyleSheet'));
		assert.ok(code.includes('unsafeCSS'));
	});
});

// -----------------------------------------------------------------------------
// Integration tests — outputMode option
// -----------------------------------------------------------------------------

describe('outputMode option', () => {
	it('forces CSSResult on client when outputMode is "CSSResult"', async () => {
		const code = await buildFixture('entry-css.ts', {
			pluginOptions: { outputMode: 'CSSResult' },
		});
		assert.ok(code.includes('unsafeCSS'));
		assert.ok(!code.includes('__sheet_'));
		assert.ok(code.includes('color:red'));
	});

	it('forces CSSStyleSheet in SSR when outputMode is "CSSStyleSheet"', async () => {
		const code = await buildFixture('entry-css.ts', {
			ssr: true,
			pluginOptions: { outputMode: 'CSSStyleSheet' },
		});
		assert.ok(code.includes('new CSSStyleSheet'));
		assert.ok(code.includes('replaceSync'));
		assert.ok(!code.includes('unsafeCSS'));
	});

	it('forces CSSStyleSheet even for css-lit imports', async () => {
		const code = await buildFixture('entry-css-lit.ts', {
			pluginOptions: { outputMode: 'CSSStyleSheet' },
		});
		assert.ok(code.includes('new CSSStyleSheet'));
		assert.ok(code.includes('replaceSync'));
		assert.ok(!code.includes('unsafeCSS'));
	});

	it('forces CSSResult for all imports in multi-import file', async () => {
		const code = await buildFixture('entry-multi.ts', {
			pluginOptions: { outputMode: 'CSSResult' },
		});
		assert.ok(code.includes('unsafeCSS'));
		assert.ok(!code.includes('__sheet_'));
	});
});
