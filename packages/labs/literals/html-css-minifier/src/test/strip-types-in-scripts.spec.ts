/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { defaultMinifyOptions, defaultStrategy } from '../strategy.js';
import {
	extractTypeScriptScripts,
	stripTypeScriptInScripts,
} from '../strip-types.js';

describe('extractTypeScriptScripts()', () => {
	it('should extract a basic <script lang="ts"> block', () => {
		const html = '<div><script lang="ts">const x: number = 1;</script></div>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, 'const x: number = 1;');
	});

	it('should extract <script lang="typescript"> blocks', () => {
		const html = '<script lang="typescript">const x: string = "hi";</script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, 'const x: string = "hi";');
	});

	it('should handle single-quoted lang attribute', () => {
		const html = "<script lang='ts'>const x: number = 1;</script>";
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, 'const x: number = 1;');
	});

	it('should be case-insensitive for the tag name', () => {
		const html = '<SCRIPT lang="ts">const x: number = 1;</SCRIPT>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
	});

	it('should be case-insensitive for lang value', () => {
		const html = '<script lang="TS">const x: number = 1;</script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
	});

	it('should handle spaces around = in lang attribute', () => {
		const html = '<script lang = "ts">const x: number = 1;</script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, 'const x: number = 1;');
	});

	it('should handle additional attributes alongside lang', () => {
		const html =
			'<script type="module" lang="ts" defer>const x: number = 1;</script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.ok(blocks[0].attributes.includes('type="module"'));
		assert.ok(blocks[0].attributes.includes('defer'));
	});

	it('should handle lang attribute appearing first', () => {
		const html =
			'<script lang="ts" type="module">const x: number = 1;</script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
	});

	it('should handle multiline attributes', () => {
		const html = `<script
  lang="ts"
  type="module"
>const x: number = 1;</script>`;
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, 'const x: number = 1;');
	});

	it('should extract multiple TypeScript script blocks', () => {
		const html = `
			<script lang="ts">const a: number = 1;</script>
			<p>hello</p>
			<script lang="ts">const b: string = "hi";</script>
		`;
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 2);
		assert.strictEqual(blocks[0].content, 'const a: number = 1;');
		assert.strictEqual(blocks[1].content, 'const b: string = "hi";');
	});

	it('should skip non-TypeScript script blocks', () => {
		const html = `
			<script>console.log("plain js");</script>
			<script lang="ts">const x: number = 1;</script>
			<script type="module">console.log("module");</script>
		`;
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, 'const x: number = 1;');
	});

	it('should not match <scripting> or similar tags', () => {
		const html = '<scripting lang="ts">not a script</scripting>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 0);
	});

	it('should handle > inside quoted attribute values', () => {
		const html =
			'<script lang="ts" data-info="a > b">const x: number = 1;</script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, 'const x: number = 1;');
	});

	it('should handle script content containing string with </script pattern', () => {
		const html = '<script lang="ts">const x: string = "<\\/script>";</script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
	});

	it('should handle multiline script content', () => {
		const content = `
			interface Foo {
				bar: string;
				baz: number;
			}
			const obj: Foo = { bar: "hello", baz: 42 };
			console.log(obj);
		`;
		const html = `<script lang="ts">${content}</script>`;
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, content);
	});

	it('should handle empty script content', () => {
		const html = '<script lang="ts"></script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 1);
		assert.strictEqual(blocks[0].content, '');
	});

	it('should skip script with lang="js" or other values', () => {
		const html = '<script lang="js">const x = 1;</script>';
		const blocks = extractTypeScriptScripts(html);
		assert.strictEqual(blocks.length, 0);
	});
});

describe('stripTypeScriptInScripts()', () => {
	it('should strip type annotations from script content', () => {
		const html = '<div><script lang="ts">const x: number = 1;</script></div>';
		const result = stripTypeScriptInScripts(html);
		assert.ok(result.includes('const x = 1;'));
		assert.ok(!result.includes(': number'));
	});

	it('should remove the lang attribute from the output', () => {
		const html = '<script lang="ts">const x: number = 1;</script>';
		const result = stripTypeScriptInScripts(html);
		assert.ok(!result.includes('lang='));
		assert.ok(result.includes('<script>'));
	});

	it('should preserve other attributes when removing lang', () => {
		const html =
			'<script type="module" lang="ts" defer>const x: number = 1;</script>';
		const result = stripTypeScriptInScripts(html);
		assert.ok(result.includes('type="module"'));
		assert.ok(result.includes('defer'));
		assert.ok(!result.includes('lang='));
	});

	it('should strip interface declarations', () => {
		const html = `<script lang="ts">
interface User {
	name: string;
	age: number;
}
const user: User = { name: "Alice", age: 30 };
</script>`;
		const result = stripTypeScriptInScripts(html);
		assert.ok(!result.includes('interface User'));
		assert.ok(!result.includes(': User'));
		assert.ok(result.includes('const user = { name: "Alice", age: 30 }'));
	});

	it('should strip type aliases', () => {
		const html =
			'<script lang="ts">type ID = string | number; const id: ID = "abc";</script>';
		const result = stripTypeScriptInScripts(html);
		assert.ok(!result.includes('type ID'));
		assert.ok(!result.includes(': ID'));
		assert.ok(result.includes('const id = "abc"'));
	});

	it('should strip generic type parameters', () => {
		const html =
			'<script lang="ts">function identity<T>(value: T): T { return value; }</script>';
		const result = stripTypeScriptInScripts(html);
		assert.ok(!result.includes('<T>'));
		assert.ok(!result.includes(': T'));
		assert.ok(result.includes('function identity(value)'));
	});

	it('should strip type assertions (as)', () => {
		const html =
			'<script lang="ts">const el = document.getElementById("app") as HTMLDivElement;</script>';
		const result = stripTypeScriptInScripts(html);
		assert.ok(!result.includes('as HTMLDivElement'));
		assert.ok(result.includes('document.getElementById("app")'));
	});

	it('should not downlevel modern JS syntax', () => {
		const html = `<script lang="ts">
const fn = async (): Promise<void> => {
	const result = await fetch("url");
	const data = result?.body ?? "default";
	console.log(data);
};
</script>`;
		const result = stripTypeScriptInScripts(html);
		assert.ok(result.includes('async'));
		assert.ok(result.includes('await'));
		assert.ok(result.includes('?.'));
		assert.ok(result.includes('??'));
		assert.ok(!result.includes('Promise<void>'));
		assert.ok(!result.includes(': Promise'));
	});

	it('should leave non-TS scripts untouched', () => {
		const html =
			'<script>const x = 1;</script><script lang="ts">const y: number = 2;</script>';
		const result = stripTypeScriptInScripts(html);
		assert.ok(result.includes('<script>const x = 1;</script>'));
		assert.ok(!result.includes(': number'));
	});

	it('should return the same string when no TS scripts exist', () => {
		const html = '<div><script>console.log("hi");</script></div>';
		const result = stripTypeScriptInScripts(html);
		assert.strictEqual(result, html);
	});

	it('should handle multiple TS scripts', () => {
		const html = `
<script lang="ts">const a: number = 1;</script>
<p>middle</p>
<script lang="ts">const b: string = "hi";</script>`;
		const result = stripTypeScriptInScripts(html);
		assert.ok(!result.includes(': number'));
		assert.ok(!result.includes(': string'));
		assert.ok(result.includes('<p>middle</p>'));
	});
});

describe('minifyHTML with TypeScript stripping (integration)', () => {
	it('should strip types and then minify HTML', async () => {
		const html = `
			<div>
				<script lang="ts">
					const greeting: string = "hello";
					console.log(greeting);
				</script>
				<p>   content   </p>
			</div>
		`;
		const result = await defaultStrategy.minifyHTML(html, defaultMinifyOptions);
		assert.ok(!result.includes(': string'));
		assert.ok(!result.includes('lang='));
		assert.ok(result.includes('console.log('));
		assert.ok(result.includes('<p>content</p>'));
	});

	it('should handle TS scripts alongside template placeholders', async () => {
		const placeholder = '@TEMPLATE_EXPRESSION();';
		const html = `
			<div class="${placeholder}">
				<script lang="ts">
					const x: number = 42;
				</script>
				<p>${placeholder}</p>
			</div>
		`;
		const result = await defaultStrategy.minifyHTML(html, defaultMinifyOptions);
		assert.ok(!result.includes(': number'));
		const parts = defaultStrategy.splitHTMLByPlaceholder(result, placeholder);
		assert.strictEqual(parts.length, 3);
	});

	it('should handle script with multiline attributes after minification', async () => {
		const html = `<div>
			<script
				lang="ts"
				type="module"
			>
				interface Config { debug: boolean; }
				const config: Config = { debug: true };
			</script>
		</div>`;
		const result = await defaultStrategy.minifyHTML(html, defaultMinifyOptions);
		assert.ok(!result.includes('interface Config'));
		assert.ok(!result.includes(': Config'));
		assert.ok(!result.includes(': boolean'));
		assert.ok(result.includes('type="module"'));
	});
});
