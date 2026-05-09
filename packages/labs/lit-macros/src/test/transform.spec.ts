/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, it, before } from 'node:test';

import { transformLitMacros } from '../transform/index.js';
import { resolveParseSync, resolveVisitor } from '../resolve-deps.js';
import type { ParseSync, VisitorClass } from '../resolve-deps.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const FIXTURES_DIR = resolve(import.meta.dirname, '..', '..', '__fixtures__');

function readFixture(name: string, file: string): string {
	return readFileSync(join(FIXTURES_DIR, name, file), 'utf8');
}

/** Normalise whitespace so minor formatting diffs don't fail the test. */
function normalise(text: string): string {
	return text
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.replaceAll(/\n{3,}/g, '\n\n')
		.trim();
}

// ---------------------------------------------------------------------------
// Setup — resolve OXC deps once.
// ---------------------------------------------------------------------------

let parseSync: ParseSync;
let Visitor: VisitorClass;

before(async () => {
	[parseSync, Visitor] = await Promise.all([
		resolveParseSync(),
		resolveVisitor(),
	]);
});

// ---------------------------------------------------------------------------
// Fixture-driven tests
// ---------------------------------------------------------------------------

describe('transformLitMacros', () => {
	it('basic — @customElement + @property + @state', () => {
		const input = readFixture('basic', 'input.ts');
		const expected = readFixture('basic', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'basic.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('property-options — reflect, attribute, type variants', () => {
		const input = readFixture('property-options', 'input.ts');
		const expected = readFixture('property-options', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'property-options.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('state — @state() with and without extra options', () => {
		const input = readFixture('state', 'input.ts');
		const expected = readFixture('state', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'state.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('no-transform — file without Lit decorators returns null', () => {
		const input = readFixture('no-transform', 'input.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'no-transform.ts',
		});

		assert.equal(result, null);
	});

	it('partial-import — keeps import when not all specifiers consumed', () => {
		const input = readFixture('partial-import', 'input.ts');
		const expected = readFixture('partial-import', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'partial-import.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('aliased-import — handles `import { property as prop }`', () => {
		const input = readFixture('aliased-import', 'input.ts');
		const expected = readFixture('aliased-import', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'aliased-import.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('multiple-classes — transforms several classes in one file', () => {
		const input = readFixture('multiple-classes', 'input.ts');
		const expected = readFixture('multiple-classes', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'multiple-classes.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('query-basic — @query, @queryAll, @queryAsync → getters', () => {
		const input = readFixture('query-basic', 'input.ts');
		const expected = readFixture('query-basic', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'query-basic.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('query-assigned — @queryAssignedElements, @queryAssignedNodes → getters', () => {
		const input = readFixture('query-assigned', 'input.ts');
		const expected = readFixture('query-assigned', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'query-assigned.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('existing-constructor — appends inits after super(), keeps body', () => {
		const input = readFixture('existing-constructor', 'input.ts');
		const expected = readFixture('existing-constructor', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'existing-constructor.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('accessor-mixed — accessor and non-accessor fields produce same output', () => {
		const input = readFixture('accessor-mixed', 'input.ts');
		const expected = readFixture('accessor-mixed', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'accessor-mixed.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});

	it('localized — @localized() → updateWhenLocaleChanges(this) in constructor', () => {
		const input = readFixture('localized', 'input.ts');
		const expected = readFixture('localized', 'expected.ts');

		const result = transformLitMacros(input, parseSync, Visitor, {
			sourceFileName: 'localized.ts',
		});

		assert.ok(result, 'transform should produce output');
		assert.equal(normalise(result.code), normalise(expected));
	});
});

// ---------------------------------------------------------------------------
// Inline micro-tests
// ---------------------------------------------------------------------------

describe('transformLitMacros — edge cases', () => {
	it('returns null for files without decorator syntax', () => {
		const source = `
			import { LitElement, html } from 'lit';
			class Foo extends LitElement {
				render() { return html\`<p>hi</p>\`; }
			}
		`;
		const result = transformLitMacros(source, parseSync, Visitor);
		assert.equal(result, null);
	});

	it('generates a sourcemap', () => {
		const source = `
import { customElement } from 'lit/decorators.js';
import { LitElement } from 'lit';
@customElement('x-map')
class XMap extends LitElement {}
`;
		const result = transformLitMacros(source, parseSync, Visitor, {
			sourceFileName: 'x-map.ts',
		});

		assert.ok(result);
		assert.ok(result.map);
		assert.equal(typeof result.map.toString(), 'string');
	});

	it('handles @property without call expression (bare decorator)', () => {
		const source = `
import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
class Bare extends LitElement {
	@property
	name = '';
}
`;
		const result = transformLitMacros(source, parseSync, Visitor, {
			sourceFileName: 'bare.ts',
		});

		assert.ok(result);
		assert.ok(result.code.includes('static properties'));
		assert.ok(result.code.includes('name: {}'));
		assert.ok(result.code.includes('this.name'));
	});

	it('skips computed property names', () => {
		const source = `
import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
const key = 'dynamic';
class Comp extends LitElement {
	@property()
	[key] = '';
}
`;
		const result = transformLitMacros(source, parseSync, Visitor);
		// Computed keys can't be in static properties — nothing to transform.
		assert.equal(result, null);
	});

	it('skips static fields', () => {
		const source = `
import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
class StaticField extends LitElement {
	@property()
	static name = 'static';
}
`;
		const result = transformLitMacros(source, parseSync, Visitor);
		assert.equal(result, null);
	});

	it('handles @reactive-element import source', () => {
		const source = `
import { property } from '@lit/reactive-element/decorators.js';
import { LitElement } from 'lit';
class ReactEl extends LitElement {
	@property({type: String})
	name = '';
}
`;
		const result = transformLitMacros(source, parseSync, Visitor, {
			sourceFileName: 'react-el.ts',
		});

		assert.ok(result);
		assert.ok(result.code.includes('static properties'));
		assert.ok(result.code.includes('name: {type: String}'));
		assert.ok(result.code.includes('this.name'));
	});
});
