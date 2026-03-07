/* eslint-disable @typescript-eslint/no-explicit-any */

/* import { pluginTester } from 'babel-plugin-tester';
import babelPluginJsx from './babel-plugin-jsx.js';
import { describe, it } from 'node:test';

globalThis.describe = describe;
globalThis.it = it;

function testOne() {
	console.log('KO');
}

pluginTester({
	plugin: babelPluginJsx,
	tests: [
		{
			code: '',
			output: '',
		},
	],
});
 */
/* eslint-disable @typescript-eslint/no-floating-promises */

import test, { describe /* type TestContextAssert */ } from 'node:test';

import { renderRaw } from './test-utils.js';

// import { assertEqual } from 'snapshot-fixtures';

// TODO:
// - Auto-imports.
// - Props. spreading.

// HACK: Experimental Node API

describe('Complex children', () => {
	const rendered = renderRaw(
		/* tsx */ 'const MyComp = ({ children }) => <a>{children}</a>;' +
			'const MyComp2 = ({ children }) => <article>{children?.()}</article>;' +
			'testResult = <><MyComp>\nZebra{() => null}\n</MyComp> <MyComp2>\n{() => "abc"}\n</MyComp2></>;',
	);
	test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
	test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
});

describe('Basics', () => {
	test('HTML parent element', ({ assert: a }) =>
		a.snapshot(renderRaw(/* tsx */ `testResult = <div>Hello</div>;`).ssr));

	test('Simple attributes', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ `testResult = <div style="color: red;" data-my="Attr." width={2} hidden>Hello</div>;`,
			).ssr,
		));

	test('Body expression', ({ assert: a }) =>
		a.snapshot(renderRaw(/* tsx */ 'testResult = <div>{"Hello"}</div>;').ssr));

	test('Deeply nested with body expression', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'testResult = <div><main><article>{"Hello"}</article></main></div>;',
			).ssr,
		));

	test('Attribute expression', ({ assert: a }) =>
		a.snapshot(
			renderRaw(/* tsx */ 'testResult = <div title={"Bonjour"}>Hello</div>;')
				.ssr,
		));

	test('Fragment parent element', ({ assert: a }) =>
		a.snapshot(renderRaw(/* tsx */ 'testResult = <>Hey</>;').ssr));

	test('Component in top level parent fragment and children', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'const MyComp = ({ children }) => <>{children}</>; testResult = <><MyComp>Lion</MyComp></>;',
			).ssr,
		));

	test('Component with nested children', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'const MyComp = ({ children }) => <>{children}</>; testResult = <MyComp><main><span>Seagull</span></main></MyComp>;',
			).ssr,
		));

	test('Component with object property access', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'const top = { MyComp: ({ children }) => <main><span>{children}</span></main> }; testResult = <top.MyComp>Donkey</top.MyComp>;',
			).ssr,
		));

	test('Top level Component with parent element and attributes', ({
		assert: a,
	}) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'const MyComp = ({ title, children }) => <div title={title}>{children}</div>; testResult = <MyComp title={"my title"}>Penguin</MyComp>;',
			).ssr,
		));

	describe('Empty expression are skipped', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <main title={"my title"}>Lion{/* EMPTY */}</main>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});

	test('Backtick characters in text escaping', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'testResult = <main title={"my title"}> ` Lion escaped {/* `Hey` */}</main>;',
			).ssr,
		));

	test('Block comments in attributes', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'testResult = <main /* block1\n\n */ title={"my title"}/* block2\n\n */>Turtle</main>;',
			).ssr,
		));

	test('Line comments in attributes', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'testResult = <main \n// line 1\n  title={"my title"}\n// line 2\n>Pig</main>;',
			).ssr,
		));

	test('Expand self-closing XML tag to HTML compliant tag', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'const MyComp = () => <i>ola</i>; testResult = <><label for="stuff" /><hr /><br/><img src="#" /><MyComp /></>;',
			).ssr,
		));

	test('Lowercase (native) event handler are untouched', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'testResult = <span onclick="alert();" onmouseenter="console.log()"></span>;',
			).ssr,
		));
});

describe('Server/Client bindings', () => {
	describe('Prop. binding', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <div prop:heyaa={2}>Hello</div>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});

	describe('Event. binding', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <div onClick={console.log}>Hello</div>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});

	describe('Event. binding - Custom element (`on:` prefix)', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <my-custom on:some-event={(e => event.target)}>Hello</my-custom>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});

	describe('Ref. binding', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <main foo="bar" use:ref={createRef()} baz="doz">Referenced</main>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});

	// NOTE: Signals APIs and implementations are not stable yet.
	// describe('Computed', () => {
	// 	const rendered = renderRaw(
	// 		/* tsx */ 'testResult = <main onClick={() => null} baz={() => null}>{() => null}</main>;',
	// 		// /* tsx */ 'testResult = <main>{() => null}</main>;',
	// 	);
	// 	test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
	// 	test('client', ({ assert: a }) =>
	// 		a.snapshot(rendered.transformed));
	// });
});

describe('Attr. Helpers', () => {
	describe('Attribute serializer', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <div attr:some-obj={{ title: "my title" }}>Ant</div>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});

	describe('Class map', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <div class:map={{ someClass: true }}>Ant</div>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});

	describe('Style map', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <div style:map={{ borderColor: "red" }}>Ant</div>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});
});

describe('Component Helpers', () => {
	// NOTE: Disabled for now.
	// describe('Show (presence)', () => {
	// 	const rendered = renderRaw(
	// 		/* tsx */ 'testResult = <div><Show when={true}>Hello</Show><Show when={false}>Oh no</Show></div>;',
	// 	);
	// 	test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
	// 	test('client', ({ assert: a }) =>
	// 		a.snapshot(rendered.transformed));
	// });

	describe('For (loop)', () => {
		const rendered = renderRaw(
			/* tsx */ 'testResult = <div><For each={["foo", "bar"]}>{(id) => <span for:key={id}>{id}</span>}</For></div>;',
		);
		test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
		test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
	});
});

describe('Mix and match', () => {
	test('Literal Snippet in JSX', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'testResult = <main title={"my title"}>{html`<span>Whale</span>`}</main>;',
			).ssr,
		));

	test('JSX Snippet in Literal in JSX', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'testResult = html`<main>${<div title={"my title"}><span>Orca</span></div>}</main>`;',
			).ssr,
		));

	test('Literal Component in JSX', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'const MyComp = ({ title, children }) => html`<div title=${title}>${children}</div>`; testResult = <MyComp title={"my title"}>Chimpanzee</MyComp>;',
			).ssr,
		));

	test('JSX Component in Literal in TSX', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'const MyComp = ({ title, children }) => <div title={title}>{children}</div>; testResult = html`<main>${<MyComp title={"my title"}>Bonobo</MyComp>}</main>`;',
			).ssr,
		));

	test('JSX Component in Literal in TS vanilla', ({ assert: a }) =>
		a.snapshot(
			renderRaw(
				/* tsx */ 'const MyComp = ({ title, children }) => <div title={title}>{children}</div>; testResult = html`<main>${MyComp({ title: "my title", children: html`Snail` })}</main>`;',
			).ssr,
		));
});

// TODO:
// describe('Directives - Server', () => {
// 	const rendered = renderRaw(
// 		/* tsx */ '"use html-signal";\nconst result = html`<div>Hello</div>`',
// 	);
// 	test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
// 	test('client', ({ assert: a }) => a.snapshot(rendered.ssr));
// });

// MARK: Kitchen Sink

describe('ABC', () => {
	const rendered = renderRaw(
		/* tsx */ `testResult = <todo-footer class={classMap({ hidden: true, })} prop:todoList={[]}></todo-footer>`,
	);
	test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
	test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
});

describe('DEF', () => {
	const rendered = renderRaw(
		/* tsx */ `testResult = <input onChange={() => null} id="toggle-all" type="checkbox" class="toggle-all" prop:checked={true ?? false} />`,
	);
	test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
	test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
});

describe('GHI', () => {
	const rendered = renderRaw(
		/* tsx */ `let todo = { title: "my title" }; testResult = <input class="edit" value={todo.title} />`,
	);
	test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
	test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
});

describe('Imports - ref, classList, classMap, styleMap, unsafeHTML, ifDefined', () => {
	const rendered = renderRaw(
		/* tsx */
		'const testResult = <div use:ref={() => {}} class:list={{}} class:map={{}} style:map={{}} unsafe:html={"abc"} if:something={"something"}></div>;',
		true,
	);

	test('client', ({ assert: a }) => a.snapshot(rendered.transformed));
});

describe('Imports - JS directives, Lit flavors (normal, server, signal)', () => {
	const renderedNormal = renderRaw(
		/* tsx */
		'const testResult = <div>Abc</div>;',
		true,
	);
	test('client', ({ assert: a }) => a.snapshot(renderedNormal.transformed));

	const renderedServer = renderRaw(
		/* tsx */
		'"use html-server"; const testResult = <div>Abc</div>;',
		true,
	);
	test('client', ({ assert: a }) => a.snapshot(renderedServer.transformed));

	const renderedSignal = renderRaw(
		/* tsx */
		'"use html-signal"; const testResult = <div>Abc</div>;',
		true,
	);
	test('client', ({ assert: a }) => a.snapshot(renderedSignal.transformed));
});

describe('<For> component', () => {
	const rendered = renderRaw(
		/* tsx */ 'testResult = <div><For each={["foo", "bar"]}>{(id) => <span for:key={id}>{id}</span>}</For></div>;',
	);
	test('ssr', ({ assert: a }) => a.snapshot(rendered.ssr));
});
