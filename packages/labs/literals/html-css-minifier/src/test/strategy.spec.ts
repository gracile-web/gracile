/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, it } from 'node:test';

import { expect } from 'chai';
import { minify } from 'html-minifier-terser';
import { TemplatePart } from '@literals/parser';

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
				expect(placeholder.indexOf('@')).to.equal(0, 'should start with @');
				expect(placeholder).to.include('()', 'should contain function parens');
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

				expect(oneUnderscore).not.to.equal(regularPlaceholder);
				expect(oneUnderscore).to.include('_');

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

				expect(twoUnderscores).not.to.equal(regularPlaceholder);
				expect(twoUnderscores).not.to.equal(oneUnderscore);
				expect(twoUnderscores).to.include('__');
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
				expect(
					defaultStrategy.splitHTMLByPlaceholder(minHtml, placeholder),
				).to.have.lengthOf(9);
			});
		});

		describe('combineHTMLStrings()', () => {
			it('should join part texts by the placeholder', () => {
				const expected = '<h1>EXP</h1>';
				expect(defaultStrategy.combineHTMLStrings(parts, 'EXP')).to.equal(
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
				// Tag positions should use a valid custom element name, not the @ placeholder
				expect(result).to.include('<template-expression-tag');
				expect(result).to.include('</template-expression-tag>');
				// Attribute positions should still use the regular placeholder
				expect(result).to.include(placeholder);
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

				expect(
					await defaultStrategy.minifyHTML(html, defaultMinifyOptions),
				).to.equal(await minify(html, defaultMinifyOptions));
			});
		});

		describe('splitHTMLByPlaceholder()', () => {
			it('should split string by the placeholder', () => {
				const expected = ['<h1>', '</h1>'];
				expect(
					defaultStrategy.splitHTMLByPlaceholder('<h1>EXP</h1>', 'EXP'),
				).to.deep.equal(expected);
			});

			it('should handle if a placeholder is missing its semicolon', () => {
				const expected = ['<h1>', '</h1><button onclick="', '"></button>'];
				const html = `<h1>EXP;</h1><button onclick="EXP"></button>`;
				expect(
					defaultStrategy.splitHTMLByPlaceholder(html, 'EXP;'),
				).to.deep.equal(expected);
			});

			it('should split by tag placeholder for dynamic tag names', () => {
				const html =
					'<template-expression-tag class="foo">content</template-expression-tag>';
				const expected = ['<', ' class="foo">content</', '>'];
				expect(
					defaultStrategy.splitHTMLByPlaceholder(
						html,
						'@TEMPLATE_EXPRESSION();',
					),
				).to.deep.equal(expected);
			});
		});

		describe('dynamic tag names (end-to-end)', () => {
			it('should minify HTML with dynamic tag names without parse errors', async () => {
				// Simulates: html`<${tag} part="base" class=${cls}></${tag}>`
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

				// Should not throw a parse error
				const minified = await defaultStrategy.minifyHTML(
					combined,
					defaultMinifyOptions,
				);
				const splitParts = defaultStrategy.splitHTMLByPlaceholder(
					minified,
					placeholder,
				);

				// 4 parts = 3 expressions + surrounding text
				expect(splitParts).to.have.lengthOf(4);
				expect(splitParts[0]).to.equal('<');
				expect(splitParts.at(-1)).to.equal('>');
			});
		});
	});
});
