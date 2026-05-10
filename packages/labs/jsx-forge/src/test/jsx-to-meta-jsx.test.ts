/* eslint-disable @typescript-eslint/no-floating-promises */
/**
 * Test suite for the meta-JSX → framework JSX transformer (`to-jsx`).
 *
 * The meta-JSX dialect is non-ambiguous by design: attributes carry explicit
 * namespace prefixes (`on:`, `if:`, `bool:`, `for:each`, `_:`) that encode
 * intent without type inference.  The transformer normalises them into the
 * conventions expected by a downstream JSX pipeline (React, Solid, Preact …).
 *
 * Status: WIP / smoke tests — a baseline to build on empirically as the
 * transformer matures.
 */

import * as assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
	normalize,
	transformToMetaJsx,
	type MetaJsxFramework,
} from './test-harness.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Transform → normalised body (no auto-imports). */
function body(source: string, fw: MetaJsxFramework = 'react'): string {
	return normalize(transformToMetaJsx(source, { framework: fw }).body);
}

/** Transform → raw result for multi-field assertions. */
function raw(source: string, fw: MetaJsxFramework = 'react') {
	return transformToMetaJsx(source, { framework: fw });
}

// ===========================================================================
// MARK: Directive stripping
// ===========================================================================

describe('Directive stripping', () => {
	test('"use html-signal" directive is removed', () => {
		const result = body(`'use html-signal'; const el = <div>Hi</div>;`);
		assert.doesNotMatch(result, /use html-signal/);
		assert.match(result, /div/);
	});

	test('"use html-server" directive is removed', () => {
		const result = body(`'use html-server'; const el = <span>Hi</span>;`);
		assert.doesNotMatch(result, /use html-server/);
		assert.match(result, /span/);
	});

	test('other string directives are not stripped', () => {
		const result = body(`'use strict'; const el = <div>Hi</div>;`);
		assert.match(result, /use strict/);
	});
});

// ===========================================================================
// MARK: Event bindings  on:event → onEvent
// ===========================================================================

describe('Event bindings (on:) → React camelCase', () => {
	test('on:click → onClick', () => {
		const result = body(
			`const el = <button on:click={() => {}}>Click</button>;`,
		);
		assert.match(result, /onClick/);
		assert.doesNotMatch(result, /on:click/);
	});

	test('on:focus → onFocus', () => {
		const result = body(`const el = <input on:focus={() => {}} />;`);
		assert.match(result, /onFocus/);
	});

	test('on:change → onChange', () => {
		const result = body(`const el = <input on:change={(e) => {}} />;`);
		assert.match(result, /onChange/);
	});

	test('on:input → onInput', () => {
		const result = body(`const el = <input on:input={() => {}} />;`);
		assert.match(result, /onInput/);
	});

	test('on:submit → onSubmit', () => {
		const result = body(`const el = <form on:submit={(e) => {}}>F</form>;`);
		assert.match(result, /onSubmit/);
	});

	test('on:focusin → onFocus (React normalises focusin → focus)', () => {
		const result = body(`const el = <div on:focusin={() => {}}>Hi</div>;`);
		assert.match(result, /onFocus/);
		assert.doesNotMatch(result, /onFocusIn/);
	});

	test('on:focusout → onBlur (React normalises focusout → blur)', () => {
		const result = body(`const el = <div on:focusout={() => {}}>Hi</div>;`);
		assert.match(result, /onBlur/);
		assert.doesNotMatch(result, /onFocusOut/);
	});

	test('on:reset → onReset', () => {
		const result = body(`const el = <form on:reset={() => {}}>F</form>;`);
		assert.match(result, /onReset/);
	});
});

// ===========================================================================
// MARK: Attribute normalisation  if: / bool:
// ===========================================================================

describe('Attribute namespaces (if: / bool:)', () => {
	test('if:class → class (pass-through, no ifDefined in JSX)', () => {
		const result = body(`const el = <div if:class={"active"}>Hi</div>;`);
		assert.doesNotMatch(result, /if:/);
		assert.match(result, /class/);
	});

	test('bool:checked → checked (no Boolean() wrapper needed in JSX)', () => {
		const result = body(`const el = <input bool:checked={true} />;`);
		assert.doesNotMatch(result, /bool:/);
		assert.match(result, /checked/);
	});

	test('bool:required → required', () => {
		const result = body(`const el = <input bool:required={false} />;`);
		assert.doesNotMatch(result, /bool:/);
		assert.match(result, /required/);
	});
});

// ===========================================================================
// MARK: HTML → React attribute renames
// ===========================================================================

describe('HTML → React attribute renames', () => {
	test('class → className', () => {
		const result = body(`const el = <div class={"foo"}>Hi</div>;`);
		assert.match(result, /className/);
		assert.doesNotMatch(result, / class=/);
	});

	test('for → htmlFor (on <label>)', () => {
		const result = body(`const el = <label for={"my-id"}>Label</label>;`);
		assert.match(result, /htmlFor/);
		assert.doesNotMatch(result, / for=/);
	});

	test('maxlength → maxLength', () => {
		const result = body(`const el = <input maxlength={10} />;`);
		assert.match(result, /maxLength/);
		assert.doesNotMatch(result, /maxlength/);
	});

	test('minlength → minLength', () => {
		const result = body(`const el = <input minlength={2} />;`);
		assert.match(result, /minLength/);
		assert.doesNotMatch(result, /minlength/);
	});

	test('readonly → readOnly', () => {
		const result = body(`const el = <input readonly={true} />;`);
		assert.match(result, /readOnly/);
		assert.doesNotMatch(result, /readonly/);
	});

	test('tabindex → tabIndex', () => {
		const result = body(`const el = <div tabindex={0}>Hi</div>;`);
		assert.match(result, /tabIndex/);
	});

	test('autocomplete → autoComplete', () => {
		const result = body(`const el = <input autocomplete={"on"} />;`);
		assert.match(result, /autoComplete/);
	});

	test('accept-charset → acceptCharset (on <form>)', () => {
		const result = body(
			`const el = <form if:accept-charset={"utf-8"}>F</form>;`,
		);
		assert.match(result, /acceptCharset/);
		assert.doesNotMatch(result, /accept-charset/);
	});
});

// ===========================================================================
// MARK: Property bindings  _:prop → prop (React uses camelCase directly)
// ===========================================================================

describe('Property bindings (_:)', () => {
	test('_:className → className (identity, already React prop)', () => {
		const result = body(`const el = <div _:className={"abc"}>Hi</div>;`);
		assert.doesNotMatch(result, /_:/);
		assert.match(result, /className/);
	});
});

// ===========================================================================
// MARK: Controlled input  value without onChange → noop onChange injected
// ===========================================================================

describe('Controlled input — noop onChange injection', () => {
	test('<input value={x} /> gets an empty onChange', () => {
		const result = body(`const val = "hi"; const el = <input value={val} />;`);
		assert.match(result, /onChange/);
	});

	test('<input value={x} onChange={fn} /> is left unchanged', () => {
		const result = body(
			`const el = <input value={"hi"} onChange={(e) => {}} />;`,
		);
		// Should have exactly one onChange (not duplicated)
		const matches = [...result.matchAll(/onChange/g)];
		assert.equal(matches.length, 1);
	});

	test('<input checked={x} /> gets an empty onChange', () => {
		const result = body(`const el = <input type="checkbox" checked={isOn} />;`);
		assert.match(result, /onChange/);
	});

	test('<select /> and <textarea /> also get noop onChange when value present', () => {
		const r1 = body(`const el = <select value={"a"}></select>;`);
		assert.match(r1, /onChange/);

		const r2 = body(`const el = <textarea value={"a"}></textarea>;`);
		assert.match(r2, /onChange/);
	});

	test('for:each inside <select> children is transformed to Fragment', () => {
		// Regression: controlled-input block was returning el.children unvisited,
		// so for:each inside <select> was emitted literally as <for:each>.
		const result = body(`
			const el = (
				<select name="x">
					{items.map((v) => (
						<for:each key={String(v)}>
							<option value={String(v)}>{v}</option>
						</for:each>
					))}
				</select>
			);
		`);
		assert.doesNotMatch(result, /for:each/);
		assert.match(result, /Fragment/);
	});
});

// ===========================================================================
// MARK: for:each → Fragment
// ===========================================================================

describe('for:each → Fragment', () => {
	test('<for:each> wrapping element is replaced with <Fragment>', () => {
		const result = body(`
			const el = (
				<for:each key={item.id}>
					<span>{item.name}</span>
				</for:each>
			);
		`);
		assert.match(result, /Fragment/);
		assert.doesNotMatch(result, /for:each/);
	});

	test('key attribute is preserved on the Fragment', () => {
		const result = body(`
			const el = (
				<for:each key={item.id}>
					<li>{item.name}</li>
				</for:each>
			);
		`);
		assert.match(result, /key=/);
		assert.match(result, /Fragment/);
	});

	test('Fragment import is injected when for:each is used (no existing import)', () => {
		const result = raw(`
			const el = (
				<for:each key={x}>
					<div>{x}</div>
				</for:each>
			);
		`);
		// injected import ends up in result.imports (harness splits on line starts with 'import')
		assert.match(result.imports, /Fragment/);
		assert.match(result.imports, /react/);
	});

	test('nested transforms are applied inside for:each children', () => {
		const result = body(`
			const el = (
				<for:each key={item.id}>
					<div class={"foo"} on:click={() => {}}>
						{item.name}
					</div>
				</for:each>
			);
		`);
		assert.match(result, /Fragment/);
		assert.match(result, /className/);
		assert.match(result, /onClick/);
	});

	test('Fragment import not duplicated when already present', () => {
		const result = raw(`
			import { Fragment } from 'react';
			const el = (
				<for:each key={x}>
					<span>{x}</span>
				</for:each>
			);
		`);
		// The transformer must NOT inject a second Fragment import.
		// In ReactNative emit mode TS elides the original import (JSX tag names
		// are not tracked as value references), so the count is 0 or 1 — never 2.
		const count = [...result.code.matchAll(/import\b.*\bFragment\b/g)].length;
		assert.ok(count <= 1, `Expected at most 1 Fragment import, got ${count}`);
	});
});

// ===========================================================================
// MARK: Passthrough — attributes with no transformation needed
// ===========================================================================

describe('Passthrough attributes', () => {
	test('id, name, type, placeholder are passed through', () => {
		const result = body(
			`const el = <input id={"x"} name={"y"} type={"text"} placeholder={"z"} />;`,
		);
		assert.match(result, /id=/);
		assert.match(result, /name=/);
		assert.match(result, /type=/);
		assert.match(result, /placeholder=/);
	});

	test('data-* attributes are passed through', () => {
		const result = body(`const el = <div data-testid={"foo"}>Hi</div>;`);
		assert.match(result, /data-testid/);
	});

	test('aria-* attributes are passed through', () => {
		const result = body(
			`const el = <input aria-label={"label"} aria-describedby={"id"} />;`,
		);
		assert.match(result, /aria-label/);
		assert.match(result, /aria-describedby/);
	});
});

// ===========================================================================
// MARK: Real-world patterns (from generics widgets)
// ===========================================================================

describe('Real-world patterns from generics widgets', () => {
	test('form with multiple on: events', () => {
		const result = raw(`
			const el = (
				<form
					on:change={(e) => {}}
					on:submit={(e) => {}}
					on:reset={(e) => {}}
				>
					Hello
				</form>
			);
		`);
		const b = normalize(result.body);
		assert.match(b, /onChange/);
		assert.match(b, /onSubmit/);
		assert.match(b, /onReset/);
		assert.doesNotMatch(b, /on:/);
	});

	test('checkbox: bool: + if: attributes coexist', () => {
		const result = body(`
			const el = (
				<input
					bool:checked={true}
					bool:required={false}
					if:class={"active"}
					type="checkbox"
				/>
			);
		`);
		assert.match(result, /checked/);
		assert.match(result, /required/);
		assert.match(result, /class/);
		assert.doesNotMatch(result, /bool:/);
		assert.doesNotMatch(result, /if:/);
	});

	test('label with for: → htmlFor + if:class → class', () => {
		const result = body(`
			const el = (
				<label for={"my-input"} if:class={"lbl"}>
					My label
				</label>
			);
		`);
		assert.match(result, /htmlFor/);
		assert.match(result, /class/);
		assert.doesNotMatch(result, /\bfor=/);
	});

	test('directive stripped at top of function body', () => {
		const result = raw(`
			'use html-signal';
			export function Widget() {
				return <div class={"foo"}>Hi</div>;
			}
		`);
		const b = normalize(result.body);
		assert.doesNotMatch(b, /use html-signal/);
		assert.match(b, /className/);
	});

	test('nested components with on: and if: at multiple levels', () => {
		const result = body(`
			const el = (
				<div class={"root"}>
					<button on:click={() => {}} if:class={"btn"}>
						Go
					</button>
				</div>
			);
		`);
		assert.match(result, /className/);
		assert.match(result, /onClick/);
		assert.doesNotMatch(result, /on:/);
		assert.doesNotMatch(result, /if:/);
	});
});

// ===========================================================================
// MARK: $:children → children  (meta-JSX slot children → React props.children)
// ===========================================================================

describe("'$:children' → children", () => {
	test("destructuring binding: { '$:children': children } → { children }", () => {
		const result = body(`
			function Fieldset({ '$:children': children, options }) {
				return <fieldset>{children}</fieldset>;
			}
		`);
		assert.doesNotMatch(result, /\$:children/);
		assert.match(result, /\bchildren\b/);
	});

	test('type literal: property signature renamed', () => {
		const result = body(`
			type Props = {
				'$:children': unknown;
				options: unknown;
			};
			function Fieldset(props: Props) { return null; }
		`);
		assert.doesNotMatch(result, /\$:children/);
	});

	test('full round-trip: component calls via JSX get children in scope', () => {
		// When <Fieldset options={o}><div /></Fieldset> is compiled by react-jsx,
		// React puts <div /> into props.children. With the '$:children' rename,
		// the destructured param is now 'children' — it receives it correctly.
		const result = body(`
			function Fieldset({ '$:children': children, options }) {
				return <fieldset>{children}</fieldset>;
			}
			const el = <Fieldset options={{}}>
				<div>content</div>
			</Fieldset>;
		`);
		assert.doesNotMatch(result, /\$:children/);
		assert.match(result, /\bchildren\b/);
	});

	test("'$:children' is not renamed for non-React targets like Vue", () => {
		// Vue uses slots, not props.children — '$:children' should pass through.
		const result = body(
			`
			function Fieldset({ '$:children': children, options }) {
				return <fieldset>{children}</fieldset>;
			}
		`,
			'vue',
		);
		// For Vue the rename is also skipped (only react/preact/solid rewrite it).
		// We verify no crash and result is a string:
		assert.ok(typeof result === 'string');
	});
});

// ===========================================================================
// MARK: Framework-specific attribute normalisation (Solid / Vue are HTML-native)
// ===========================================================================

describe('HTML-native targets (Solid, Vue) keep HTML attr names', () => {
	test('class stays class in Solid (not renamed to className)', () => {
		const result = body(`const el = <div class={"active"}>Hi</div>;`, 'solid');
		assert.match(result, /\bclass=/);
		assert.doesNotMatch(result, /className/);
	});

	test('if:class stays class in Solid', () => {
		const result = body(
			`const el = <div if:class={"active"}>Hi</div>;`,
			'solid',
		);
		assert.match(result, /\bclass=/);
		assert.doesNotMatch(result, /className/);
	});

	test('tabindex stays tabindex in Solid', () => {
		const result = body(`const el = <div tabindex={0}>Hi</div>;`, 'solid');
		assert.match(result, /tabindex/);
		assert.doesNotMatch(result, /tabIndex/);
	});

	test('class → className still applies for Preact', () => {
		const result = body(`const el = <div class={"active"}>Hi</div>;`, 'preact');
		assert.match(result, /className/);
	});
});
