/* eslint-disable @typescript-eslint/no-floating-promises */
import * as assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
	normalize,
	type TransformResult,
	transformToLiterals,
} from './test-harness.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Transform and return the normalized body (no auto-imports).
 * @param source
 */
function body(source: string): string {
	return normalize(transformToLiterals(source).body);
}

/**
 * Transform and return the full normalized code (with auto-imports).
 * @param source
 */
function full(source: string): string {
	return normalize(transformToLiterals(source).code);
}

/**
 * Transform and return the raw (non-normalized) result for exact checks.
 * @param source
 */
function raw(source: string): TransformResult {
	return transformToLiterals(source);
}

// ===========================================================================
// MARK: Basic Elements
// ===========================================================================

describe('Basic elements', () => {
	test('simple HTML element with text', () => {
		const result = body(`const el = <div>Hello</div>;`);
		assert.match(result, /html `<div>Hello<\/div>`/);
	});

	test('nested elements', () => {
		const result = body(
			`const el = <div><main><article>Hello</article></main></div>;`,
		);
		assert.match(
			result,
			/html `<div><main><article>Hello<\/article><\/main><\/div>`/,
		);
	});

	test('fragment', () => {
		const result = body(`const el = <>Hey</>;`);
		assert.match(result, /html `Hey`/);
	});

	test('self-closing void element', () => {
		const result = body(`const el = <br />;`);
		assert.match(result, /html `<br>`/);
	});

	test('multiple void elements', () => {
		const result = body(`const el = <><hr /><br /><img src="#" /></>;`);
		assert.match(result, /html `<hr><br><img src="#">`/);
	});
});

// ===========================================================================
// MARK: Attributes
// ===========================================================================

describe('Attributes', () => {
	test('static string attributes', () => {
		const result = body(
			`const el = <div style="color: red;" data-my="Attr.">Hello</div>;`,
		);
		assert.match(result, /style="color: red;"/);
		assert.match(result, /data-my="Attr."/);
	});

	test('expression attribute', () => {
		const result = body(`const el = <div title={"Bonjour"}>Hello</div>;`);
		// Expression should be interpolated
		assert.match(result, /title=\$\{"Bonjour"\}/);
	});

	test('numeric attribute', () => {
		const result = body(`const el = <div width={2}>Hello</div>;`);
		assert.match(result, /width=\$\{2\}/);
	});

	test('boolean attribute (bare)', () => {
		const result = body(`const el = <div hidden>Hello</div>;`);
		assert.match(result, /hidden/);
	});
});

// ===========================================================================
// MARK: Children Expressions
// ===========================================================================

describe('Children expressions', () => {
	test('string expression child', () => {
		const result = body(`const el = <div>{"Hello"}</div>;`);
		assert.match(result, /\$\{"Hello"\}/);
	});

	test('variable expression child', () => {
		const result = body(`const name = "World"; const el = <div>{name}</div>;`);
		assert.match(result, /\$\{name\}/);
	});

	test('empty expression (JSX comment) is omitted', () => {
		const result = body(
			`const el = <main title={"my title"}>Lion{/* EMPTY */}</main>;`,
		);
		assert.doesNotMatch(result, /EMPTY/);
		assert.match(result, /Lion/);
	});

	test('HTML comment via {/* <!--comment--> */}', () => {
		const result = body(
			`const el = <div>{/* <!-- My HTML Comment --> */}</div>;`,
		);
		assert.match(result, /<!-- My HTML Comment -->/);
	});
});

// ===========================================================================
// MARK: Backtick Escaping
// ===========================================================================

describe('Backtick escaping', () => {
	test('backtick characters in text content', () => {
		const result = raw(`const el = <main> \` Escaped </main>;`);
		// The tagged template must handle backtick chars in content
		assert.ok(result.code.includes('main'));
	});
});

// ===========================================================================
// MARK: Namespaced Attributes (Lit-specific bindings)
// ===========================================================================

describe('Namespaced attributes — Lit bindings', () => {
	test('property binding (_:)', () => {
		const result = body(`const el = <div _:className={"abc"}>Hello</div>;`);
		assert.match(result, /\.className=\$/);
	});

	test('event binding (on:)', () => {
		const result = body(`const el = <div on:click={console.log}>Hello</div>;`);
		assert.match(result, /@click=\$/);
	});

	test('boolean binding (bool:)', () => {
		const result = body(`const el = <div bool:disabled={true}>Hello</div>;`);
		// Boolean is a global builtin — no $_  prefix
		assert.match(result, /\?disabled=\$\{Boolean\(true\)\}/);
	});

	test('attr: serialised with JSON.stringify', () => {
		const result = body(
			`const el = <div attr:some-obj={{ title: "my title" }}>Ant</div>;`,
		);
		// JSON.stringify is a global builtin — no $_ prefix
		assert.match(result, /some-obj=\$\{JSON\.stringify\(/);
	});

	test('if: wrapped with ifDefined()', () => {
		const result = body(
			`const el = <div if:something={"something"}>Hello</div>;`,
		);
		assert.match(result, /something=\$\{.*ifDefined\(/);
	});

	test('use:ref wrapped with ref()', () => {
		const result = body(
			`const myRef = () => {}; const el = <main use:ref={myRef}>Referenced</main>;`,
		);
		assert.match(result, /ref\(/);
	});

	test('style:map attribute', () => {
		const result = body(
			`const el = <div style:map={{ borderColor: "red" }}>Ant</div>;`,
		);
		assert.match(result, /style=\$\{.*styleMap\(/);
	});

	test('class:map attribute', () => {
		const result = body(
			`const el = <div class:map={{ someClass: true }}>Ant</div>;`,
		);
		assert.match(result, /class=\$\{.*classMap\(/);
	});

	test('class:list attribute', () => {
		const result = body(
			`const el = <div class:list={{ active: true }}>Ant</div>;`,
		);
		assert.match(result, /class=\$\{.*clsx\(/);
	});
});

// ===========================================================================
// MARK: Unsafe HTML / SVG ($:html / $:svg attribute)
// ===========================================================================

describe('Unsafe HTML/SVG directives', () => {
	test('$:html attribute injects unsafeHTML in body', () => {
		const result = body(
			`const el = <div $:html={"<b>Bold</b>"}>Fallback</div>;`,
		);
		assert.match(result, /unsafeHTML\(/);
	});
});

// ===========================================================================
// MARK: PascalCase Components
// ===========================================================================

describe('PascalCase components', () => {
	test('component becomes function call with children', () => {
		const result = body(
			`const MyComp = ({ children }: any) => <>{children}</>; const el = <MyComp>Lion</MyComp>;`,
		);
		// PascalCase → function call MyComp({ "$:children": html`...` })
		assert.match(result, /MyComp\(\{/);
		assert.match(result, /"\$:children"/);
	});

	test('component with props', () => {
		const result = body(
			`const MyComp = ({ title, children }: any) => <div title={title}>{children}</div>;` +
				`const el = <MyComp title={"my title"}>Penguin</MyComp>;`,
		);
		assert.match(result, /MyComp\(\{/);
		// The title prop may be inlined or go through type-based transform
		assert.match(result, /"\$:children"/);
		assert.match(result, /Penguin/);
	});

	test('component with object property access', () => {
		const result = body(
			`const top = { MyComp: ({ children }: any) => <main>{children}</main> };` +
				`const el = <top.MyComp>Donkey</top.MyComp>;`,
		);
		assert.match(result, /top\.MyComp\(\{/);
	});
});

// ===========================================================================
// MARK: For-Each Directive
// ===========================================================================

describe('For-each directive', () => {
	test('for:each in .map() becomes repeat()', () => {
		const result = body(
			`const el = <div>{["foo", "bar"].map((id) => <for:each key={id}><span>{id}</span></for:each>)}</div>;`,
		);
		assert.match(result, /repeat\(/);
	});

	test('repeat() arguments are in correct order: items, keyFn, templateFn', () => {
		const result = body(
			`const el = <div>{["a", "b"].map((id) => <for:each key={id}><span>{id}</span></for:each>)}</div>;`,
		);
		// Lit signature: repeat(items, keyFn, templateFn)
		// keyFn should come before the html tagged template
		assert.match(
			result,
			/\$_repeat\(\["a", "b"\], \(id\) => \(id\), \(id\) => \(html/,
		);
	});
});

// ===========================================================================
// MARK: Use-Literal Directives
// ===========================================================================

describe('Use literal directives', () => {
	test('default — imports html from lit', () => {
		const result = raw(`const el = <div>Abc</div>;`);
		assert.match(result.imports, /from "lit"/);
		assert.match(result.imports, /\{ html \}/);
	});

	test('"use html-server" — imports from @lit-labs/ssr', () => {
		const result = raw(`"use html-server";\nconst el = <div>Hello</div>;`);
		assert.match(result.imports, /@lit-labs\/ssr/);
	});

	test('"use html-signal" — imports from @lit-labs/signals', () => {
		const result = raw(`"use html-signal";\nconst el = <div>Hello</div>;`);
		assert.match(result.imports, /@lit-labs\/signals/);
	});
});

// ===========================================================================
// MARK: Auto-Import Generation
// ===========================================================================

describe('Auto-import generation', () => {
	test('ref directive adds ref import', () => {
		const result = raw(
			`const myRef = () => {}; const el = <main use:ref={myRef}>Hi</main>;`,
		);
		assert.match(result.imports, /ref/);
		assert.match(result.imports, /lit\/directives\/ref\.js/);
	});

	test('styleMap adds styleMap import', () => {
		const result = raw(
			`const el = <div style:map={{ color: "red" }}>Hi</div>;`,
		);
		assert.match(result.imports, /styleMap/);
		assert.match(result.imports, /lit\/directives\/style-map\.js/);
	});

	test('classMap adds classMap import', () => {
		const result = raw(
			`const el = <div class:map={{ active: true }}>Hi</div>;`,
		);
		assert.match(result.imports, /classMap/);
		assert.match(result.imports, /lit\/directives\/class-map\.js/);
	});

	test('class:list adds clsx import', () => {
		const result = raw(
			`const el = <div class:list={{ active: true }}>Hi</div>;`,
		);
		assert.match(result.imports, /clsx/);
	});

	test('if: adds ifDefined import', () => {
		const result = raw(
			`const el = <div if:href={"https://example.com"}>Link</div>;`,
		);
		assert.match(result.imports, /ifDefined/);
		assert.match(result.imports, /lit\/directives\/if-defined\.js/);
	});

	test('$:html adds unsafeHTML import', () => {
		const result = raw(`const el = <div $:html={"<b>Bold</b>"}>X</div>;`);
		assert.match(result.imports, /unsafeHTML/);
		assert.match(result.imports, /lit\/directives\/unsafe-html\.js/);
	});

	test('for:each adds repeat import', () => {
		const result = raw(
			`const el = <div>{["a"].map((id) => <for:each key={id}><span>{id}</span></for:each>)}</div>;`,
		);
		assert.match(result.imports, /repeat/);
		assert.match(result.imports, /lit\/directives\/repeat\.js/);
	});

	test('antiCollisionImportPrefix applied to non-literal imports', () => {
		const result = raw(
			`const el = <div style:map={{ color: "red" }}>Hi</div>;`,
		);
		// The preset has antiCollisionImportPrefix: '$_'
		// Literal imports (html) should NOT get the prefix
		// Directive imports (styleMap) SHOULD get the prefix
		assert.match(result.imports, /\$_styleMap/);
	});
});

// ===========================================================================
// MARK: Mix and Match (Lit literals inside JSX, JSX inside literals)
// ===========================================================================

describe('Mix and match', () => {
	test('literal snippet inside JSX is preserved', () => {
		const result = body(
			'const el = <main title={"my title"}>{html`<span>Whale</span>`}</main>;',
		);
		assert.match(result, /html `<main/);
		// The inner literal (already a tagged template) passes through as an expression
		assert.match(result, /html `<span>Whale<\/span>`/);
	});
});

// ===========================================================================
// MARK: Void Elements
// ===========================================================================

describe('Void HTML elements', () => {
	test('img is self-closing in output', () => {
		const result = body(`const el = <img src="#" />;`);
		assert.match(result, /html `<img src="#">`/);
		assert.doesNotMatch(result, /<\/img>/);
	});

	test('input is self-closing in output', () => {
		const result = body(`const el = <input type="text" />;`);
		assert.match(result, /<input /);
		assert.doesNotMatch(result, /<\/input>/);
	});

	test('label is NOT void', () => {
		const result = body(`const el = <label for="stuff"></label>;`);
		assert.match(result, /<\/label>/);
	});
});

// ===========================================================================
// MARK: Complex / Kitchen Sink
// ===========================================================================

describe('Kitchen sink', () => {
	test('custom element with class:map and _: property', () => {
		const result = body(
			`const el = <todo-footer class:map={{ hidden: true }} _:todoList={[]}></todo-footer>;`,
		);
		assert.match(result, /todo-footer/);
		assert.match(result, /classMap\(/);
		assert.match(result, /\.todoList=/);
	});

	test('input with multiple bindings', () => {
		const result = body(
			`const el = <input on:change={() => null} id="toggle-all" type="checkbox" class="toggle-all" _:checked={true} />;`,
		);
		assert.match(result, /@change=/);
		assert.match(result, /\.checked=/);
		assert.match(result, /id="toggle-all"/);
	});

	test('deeply nested with mixed static and dynamic content', () => {
		const result = body(
			`const el = <ul>{["a", "b"].map((item) => <li key={item}><span>{item}</span></li>)}</ul>;`,
		);
		assert.match(result, /html `<ul>/);
		assert.match(result, /<li/);
		assert.match(result, /<span>/);
	});
});

// ===========================================================================
// MARK: Directive Removal (use html-*)
// ===========================================================================

describe('Directive string removal', () => {
	test('"use html-server" directive is replaced with annotated empty statement', () => {
		const result = raw(`"use html-server";\nconst el = <div>Hello</div>;`);
		// The directive string itself should not appear as a runtime statement
		assert.doesNotMatch(result.body, /^"use html-server";$/m);
		// But should appear as a comment annotation
		assert.match(result.code, /use html-server/);
	});
});

// ===========================================================================
// MARK: Spread Attributes
// ===========================================================================

describe('Spread attributes', () => {
	test('spread on intrinsic element', () => {
		const result = body(
			`const props = { id: "main" }; const el = <div {...props}>Hello</div>;`,
		);
		// Spread should produce individual attribute bindings pulled from the object
		assert.match(result, /html `<div/);
	});
});

// ===========================================================================
// MARK: Tagged Template Structure
// ===========================================================================

describe('Tagged template structure', () => {
	test('single static content produces NoSubstitutionTemplateLiteral', () => {
		const result = body(`const el = <div>Hello</div>;`);
		// No ${} interpolation — just html`<div>Hello</div>`
		assert.match(result, /html `<div>Hello<\/div>`/);
		assert.doesNotMatch(result, /\$\{/);
	});

	test('expression produces TemplateExpression with spans', () => {
		const result = body(`const name = "W"; const el = <div>{name}</div>;`);
		assert.match(result, /\$\{name\}/);
	});
});
