/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { minify } from 'html-minifier-next';
import type { TemplatePart } from '@literals/parser';

import { defaultMinifyOptions, defaultStrategy } from '../strategy.js';

describe('strategy', () => {
	describe('default', () => {
		const parts: TemplatePart[] = [
			{
				text: '<h1>',
				start: 0,
				end: 4,
			},
			{
				text: '</h1>',
				start: 4,
				end: 5,
			},
		];

		describe('getPlaceholder()', () => {
			it('should return a string with @ and () in it with no spaces', () => {
				const placeholder = defaultStrategy.getPlaceholder(parts);
				assert.strictEqual(placeholder.indexOf('@'), 0, 'should start with @');
				assert.ok(placeholder.includes('()'), 'should contain function parens');
			});

			it('should append "_" if placeholder exists in templates', () => {
				const regularPlaceholder = defaultStrategy.getPlaceholder(parts);
				const oneUnderscore = defaultStrategy.getPlaceholder([
					{
						text: regularPlaceholder,
						start: 0,
						end: regularPlaceholder.length,
					},
				]);

				assert.notStrictEqual(oneUnderscore, regularPlaceholder);
				assert.ok(oneUnderscore.includes('_'));

				const twoUnderscores = defaultStrategy.getPlaceholder([
					{
						text: regularPlaceholder,
						start: 0,
						end: regularPlaceholder.length,
					},
					{
						text: oneUnderscore,
						start: regularPlaceholder.length,
						end: regularPlaceholder.length + oneUnderscore.length,
					},
				]);

				assert.notStrictEqual(twoUnderscores, regularPlaceholder);
				assert.notStrictEqual(twoUnderscores, oneUnderscore);
				assert.ok(twoUnderscores.includes('__'));
			});

			it('should return a value that is preserved by html-minifier when splitting', async () => {
				const placeholder = defaultStrategy.getPlaceholder(parts);
				const minHtml = await defaultStrategy.minifyHTML(
					`
          <style>
            ${placeholder}

            p {
              ${placeholder}
              color: ${placeholder}
            }

            div {
              width: ${placeholder}
            }
          </style>
          <p style="color: ${placeholder}">
            ${placeholder}
          </p>
          <div id="${placeholder}" class="with ${placeholder}"></div>
        `,
					defaultMinifyOptions,
				);

				console.log(minHtml);

				// 8 placeholders, 9 parts
				assert.strictEqual(
					defaultStrategy.splitHTMLByPlaceholder(minHtml, placeholder).length,
					9,
				);
			});
		});

		describe('combineHTMLStrings()', () => {
			it('should join part texts by the placeholder', () => {
				const expected = '<h1>EXP</h1>';
				assert.strictEqual(
					defaultStrategy.combineHTMLStrings(parts, 'EXP'),
					expected,
				);
			});

			it('should use a valid tag placeholder for dynamic tag names', () => {
				const dynamicTagParts: TemplatePart[] = [
					{ text: '<', start: 0, end: 1 },
					{ text: ' class="foo">', start: 1, end: 14 },
					{ text: '</', start: 14, end: 16 },
					{ text: '>', start: 16, end: 17 },
				];

				const placeholder = '@TEMPLATE_EXPRESSION();';
				const result = defaultStrategy.combineHTMLStrings(
					dynamicTagParts,
					placeholder,
				);
				assert.ok(result.includes('<template-expression-tag'));
				assert.ok(result.includes('</template-expression-tag>'));
				assert.ok(result.includes(placeholder));
			});
		});

		describe('minifyHTML()', () => {
			it('should call minify() with html and options', async () => {
				const placeholder = defaultStrategy.getPlaceholder(parts);
				const html = `
          <style>${placeholder}</style>
          <h1 class="heading">${placeholder}</h1>
          <ul>
            <li>${placeholder}</li>
          </ul>
        `;

				assert.strictEqual(
					await defaultStrategy.minifyHTML(html, defaultMinifyOptions),
					await minify(html, defaultMinifyOptions),
				);
			});
		});

		describe('splitHTMLByPlaceholder()', () => {
			it('should split string by the placeholder', () => {
				const expected = ['<h1>', '</h1>'];
				assert.deepStrictEqual(
					defaultStrategy.splitHTMLByPlaceholder('<h1>EXP</h1>', 'EXP'),
					expected,
				);
			});

			it('should handle if a placeholder is missing its semicolon', () => {
				const expected = ['<h1>', '</h1><button onclick="', '"></button>'];
				const html = `<h1>EXP;</h1><button onclick="EXP"></button>`;
				assert.deepStrictEqual(
					defaultStrategy.splitHTMLByPlaceholder(html, 'EXP;'),
					expected,
				);
			});

			it('should split by tag placeholder for dynamic tag names', () => {
				const html =
					'<template-expression-tag class="foo">content</template-expression-tag>';
				const expected = ['<', ' class="foo">content</', '>'];
				assert.deepStrictEqual(
					defaultStrategy.splitHTMLByPlaceholder(
						html,
						'@TEMPLATE_EXPRESSION();',
					),
					expected,
				);
			});
		});

		describe('dynamic tag names (end-to-end)', () => {
			it('should minify HTML with dynamic tag names without parse errors', async () => {
				const dynamicTagParts: TemplatePart[] = [
					{ text: '<', start: 0, end: 1 },
					{ text: '\n        part="base"\n        class=', start: 1, end: 36 },
					{ text: '>\n      </', start: 36, end: 46 },
					{ text: '>', start: 46, end: 47 },
				];

				const placeholder = defaultStrategy.getPlaceholder(dynamicTagParts);
				const combined = defaultStrategy.combineHTMLStrings(
					dynamicTagParts,
					placeholder,
				);

				const minified = await defaultStrategy.minifyHTML(
					combined,
					defaultMinifyOptions,
				);
				const splitParts = defaultStrategy.splitHTMLByPlaceholder(
					minified,
					placeholder,
				);

				assert.strictEqual(splitParts.length, 4);
				assert.strictEqual(splitParts[0], '<');
				assert.strictEqual(splitParts.at(-1), '>');
			});
		});
	});
});
