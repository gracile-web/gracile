/* eslint-disable import-x/order */
/* eslint-disable unicorn/no-keyword-prefix */
/* eslint-disable @typescript-eslint/no-unused-vars */
import babelGenerator from '@babel/generator';
import * as parser from '@babel/parser';
import babelTraverse from '@babel/traverse';
import { styleText } from 'node:util';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { render } from '@lit-labs/ssr';
// NOTE: For evals.
import { html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { repeat } from 'lit/directives/repeat.js';

// import {
// 	For /* , Show  */,
// } from '@gracile-labs/babel-plugin-jsx-to-literals/components/for';
// // import { computed } from '@lit-labs/preact-signals';
// // import { property } from 'lit/decorators.js';

// ---

// @ts-expect-error Incorrect module def.
const traverse = babelTraverse.default as typeof babelTraverse;
// @ts-expect-error Incorrect module def.
const generate = babelGenerator.default as typeof babelGenerator;

import babelPluginJsx, {
	type PluginOptions,
} from '@gracile-labs/babel-plugin-jsx-to-literals';

export function transform(code: string, options: PluginOptions) {
	const visitor = babelPluginJsx(undefined, options).visitor;
	console.log(styleText('red', '-------------'));

	const ast = parser.parse(code, {
		sourceType: 'module',

		plugins: [
			//
			'jsx',
			'typescript',
		],
	});

	// FIXME:
	// @ts-expect-error It's not the correct way to consume a plugin visitor?
	traverse(ast, {
		...visitor,
	});

	const output = generate(ast, {}, code);

	return output;
}

export function renderRaw(code: string, autoImports = false) {
	let testResult: unknown;
	const transformed = transform(code, { autoImports }).code;
	setTimeout(() => {
		console.log('\n');
		console.log('-- code');
		console.log(code);
		console.log('\n');
		console.log('-- transformed');
		console.log(transformed);
	}, 100);

	// FIXME:
	if (autoImports === false) eval(transformed);

	const ssr = collectResultSync(render(testResult));

	setTimeout(() => {
		console.log('--- ssr');
		console.log(ssr);
		console.log('\n');
	}, 100);

	return { ssr, transformed };
}
