/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';

import MagicString, { type SourceMapOptions } from 'magic-string';
import {
	type ParseLiteralsOptions,
	type Template,
	type TemplatePart,
	parseLiterals,
} from '@literals/parser';

import {
	type SourceMap,
	defaultGenerateSourceMap,
	defaultShouldMinify,
	defaultShouldMinifyCSS,
	defaultValidation,
	minifyHTMLLiterals,
} from '../minify-html-literals.js';
import { defaultMinifyOptions, defaultStrategy } from '../strategy.js';

class MagicStringLike {
	generateMap(options?: Partial<SourceMapOptions>): SourceMap {
		return {
			version: 3,
			file: (options && options.file) || null,
			sources: [(options && options.source) || null],
			sourcesContent: [],
			names: [],
			mappings: '',
			toString() {
				return '';
			},
			toUrl() {
				return '';
			},
		};
	}

	overwrite(_start: number, _end: number, _content: string): any {
		// noop
	}

	toString(): string {
		return '';
	}
}

describe('minifyHTMLLiterals()', () => {
	const SOURCE = `
    function render(title, items, styles) {
      return html\`
        <style>
          \${styles}
        </style>
        <h1 class="heading">\${title}</h1>
        <button onclick="\${() => eventHandler()}"></button>
        <ul>
          \${items.map(item => {
            return getHTML()\`
              <li>\${item}</li>
            \`;
          })}
        </ul>
      \`;
    }

    function noMinify() {
      return \`
        <div>Not tagged html</div>
      \`;
    }

    function taggednoMinify(extra) {
      return other\`
        <style>
          .heading {
            font-size: 24px;
          }

          \${extra}
        </style>
      \`;
    }

    function taggedCSSMinify(extra) {
      return css\`
        .heading {
          font-size: 24px;
        }

        \${extra}
      \`;
    }

    function cssProperty(property) {
      const width = '20px';
      return css\`
        .foo {
          font-size: 1rem;
          width: \${width};
          color: \${property};
        }
      \`;
    }
  `;

	const SOURCE_MIN = `
    function render(title, items, styles) {
      return html\`<style>\${styles}</style><h1 class="heading">\${title}</h1><button onclick="\${() => eventHandler()}"></button><ul>\${items.map(item => {
            return getHTML()\`<li>\${item}</li>\`;
          })}</ul>\`;
    }

    function noMinify() {
      return \`
        <div>Not tagged html</div>
      \`;
    }

    function taggednoMinify(extra) {
      return other\`
        <style>
          .heading {
            font-size: 24px;
          }

          \${extra}
        </style>
      \`;
    }

    function taggedCSSMinify(extra) {
      return css\`
        .heading {
          font-size: 24px;
        }

        \${extra}
      \`;
    }

    function cssProperty(property) {
      const width = '20px';
      return css\`
        .foo {
          font-size: 1rem;
          width: \${width};
          color: \${property};
        }
      \`;
    }
  `;

	const SVG_SOURCE = `
    function taggedSVGMinify() {
      return svg\`
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M6 19h12v2H6z" />
          <path d="M0 0h24v24H0V0z" fill="none" />
        </svg>
      \`;
    }
  `;

	const SVG_SOURCE_MIN = `
    function taggedSVGMinify() {
      return svg\`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M6 19h12v2H6z"/><path d="M0 0h24v24H0V0z" fill="none"/></svg>\`;
    }
  `;

	const COMMENT_SOURCE = `
    function minifyWithComment() {
      return html\`
        <div .icon=\${0/*JS Comment */}>
        </div>
      \`;
    }
  `;

	// NOTE: html-minifier-next preserves non-standard attributes unquoted
	// (e.g. `.icon=${…}`), whereas html-minifier-terser would add quotes
	// (`.icon="${…}"`). The unquoted form matches Lit's binding syntax.
	const COMMENT_SOURCE_MIN = `
    function minifyWithComment() {
      return html\`<div .icon=\${0/*JS Comment */}></div>\`;
    }
  `;

	const SVG_MULTILINE_SOURCE = `
    function multiline() {
      return html\`
        <pre>
          Keep newlines

          within certain tags
        </pre>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M6 19h12v2H6z" />
          <path d="M0
                   0h24v24H0V0z"
                fill="none" />
        </svg>
      \`;
    }
  `;

	// NOTE: html-minifier-next trims trailing whitespace before </pre> more
	// aggressively than html-minifier-terser. The content is preserved; only
	// whitespace between the last text node and the closing tag is removed.
	const SVG_MULTILINE_SOURCE_MIN = `
    function multiline() {
      return html\`<pre>
          Keep newlines

          within certain tags</pre><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M6 19h12v2H6z"/><path d="M0                   0h24v24H0V0z" fill="none"/></svg>\`;
    }
  `;

	const SHADOW_PARTS_SOURCE = `
    function parts() {
      return css\`
        foo-bar::part(space separated) {
          color: red;
        }
      \`;
    }
  `;

	const SHADOW_PARTS_SOURCE_MIN = `
    function parts() {
      return css\`foo-bar::part(space separated){color:red}\`;
    }
  `;

	const MEMBER_EXPRESSION_LITERAL_SOURCE = `
    function nested() {
      return LitHtml.html\`<div id="container">
        <span>Some content here</span>
      </div>
      \`;
    }
  `;

	const MEMBER_EXPRESSION_LITERAL_SOURCE_MIN = `
    function nested() {
      return LitHtml.html\`<div id="container"><span>Some content here</span></div>\`;
    }
  `;

	it('should minify "html" and "css" tagged templates', async () => {
		const result = await minifyHTMLLiterals(SOURCE, { fileName: 'test.js' });
		assert.ok(result && typeof result === 'object');
		assert.strictEqual(result!.code, SOURCE_MIN);
	});

	it('should minify "svg" tagged templates', async () => {
		const result = await minifyHTMLLiterals(SVG_SOURCE, {
			fileName: 'test.js',
		});
		assert.ok(result && typeof result === 'object');
		assert.strictEqual(result!.code, SVG_SOURCE_MIN);
	});

	it('should minify html with attribute placeholders that have no quotes and JS comments', async () => {
		const result = await minifyHTMLLiterals(COMMENT_SOURCE, {
			fileName: 'test.js',
		});
		assert.ok(result && typeof result === 'object');
		assert.strictEqual(result!.code, COMMENT_SOURCE_MIN);
	});

	it('should minify html tagged with a member expression ending in html', async () => {
		const result = await minifyHTMLLiterals(MEMBER_EXPRESSION_LITERAL_SOURCE, {
			fileName: 'test.js',
		});
		assert.ok(result && typeof result === 'object');
		assert.strictEqual(result!.code, MEMBER_EXPRESSION_LITERAL_SOURCE_MIN);
	});

	it('should minify multiline svg elements', async () => {
		const result = await minifyHTMLLiterals(SVG_MULTILINE_SOURCE, {
			fileName: 'test.js',
		});
		assert.ok(result && typeof result === 'object');
		assert.strictEqual(result!.code, SVG_MULTILINE_SOURCE_MIN);
	});

	it('should not remove spaces in ::part()', async () => {
		const result = await minifyHTMLLiterals(SHADOW_PARTS_SOURCE, {
			fileName: 'test.js',
		});
		assert.ok(result && typeof result === 'object');
		assert.strictEqual(result!.code, SHADOW_PARTS_SOURCE_MIN);
	});

	it('should return null if source is already minified', async () => {
		const result = await minifyHTMLLiterals(SOURCE_MIN, {
			fileName: 'test.js',
		});
		assert.strictEqual(result, null);
	});

	it('should return a v3 source map', async () => {
		const result = await minifyHTMLLiterals(SOURCE, { fileName: 'test.js' });
		assert.ok(result && typeof result === 'object');
		assert.ok(result!.map && typeof result!.map === 'object');
		assert.strictEqual(result!.map!.version, 3);
		assert.strictEqual(typeof result!.map!.mappings, 'string');
	});

	describe('options', () => {
		let originalMinifyHTML: typeof defaultStrategy.minifyHTML;
		let minifyHTMLCalls: { args: [string, any] }[];

		beforeEach(() => {
			originalMinifyHTML = defaultStrategy.minifyHTML;
			minifyHTMLCalls = [];
			defaultStrategy.minifyHTML = ((html: string, options?: any) => {
				minifyHTMLCalls.push({ args: [html, options] });
				return originalMinifyHTML.call(defaultStrategy, html, options);
			}) as typeof defaultStrategy.minifyHTML;
		});

		afterEach(() => {
			defaultStrategy.minifyHTML = originalMinifyHTML;
		});

		it('should use defaultMinifyOptions', async () => {
			await minifyHTMLLiterals(SOURCE, { fileName: 'test.js' });
			const parts = parseLiterals(SOURCE)[1]!.parts;
			const html = defaultStrategy.combineHTMLStrings(
				parts,
				defaultStrategy.getPlaceholder(parts),
			);
			const lastCall = minifyHTMLCalls.at(-1)!;
			assert.strictEqual(lastCall.args[0], html);
			assert.deepStrictEqual(lastCall.args[1], defaultMinifyOptions);
		});

		it('should allow custom partial minifyOptions', () => {
			const minifyOptions = { caseSensitive: false };
			minifyHTMLLiterals(SOURCE, { fileName: 'test.js', minifyOptions });
			const parts = parseLiterals(SOURCE)[1]!.parts;
			const html = defaultStrategy.combineHTMLStrings(
				parts,
				defaultStrategy.getPlaceholder(parts),
			);
			const lastCall = minifyHTMLCalls.at(-1)!;
			assert.strictEqual(lastCall.args[0], html);
			assert.deepStrictEqual(lastCall.args[1], {
				...defaultMinifyOptions,
				...minifyOptions,
			});
		});

		it('should use MagicString constructor', async () => {
			let msUsed: any;
			await minifyHTMLLiterals(SOURCE, {
				fileName: 'test.js',
				generateSourceMap(ms) {
					msUsed = ms;
					return;
				},
			});

			assert.ok(msUsed instanceof (MagicString as any));
		});

		it('should allow custom MagicStringLike constructor', async () => {
			let msUsed: any;
			await minifyHTMLLiterals(SOURCE, {
				fileName: 'test.js',
				MagicString: MagicStringLike,
				generateSourceMap(ms) {
					msUsed = ms;
					return;
				},
			});

			assert.ok(msUsed instanceof MagicStringLike);
		});

		it('should allow custom parseLiterals()', async () => {
			const customParseLiterals = mock.fn(
				(source: string, options?: ParseLiteralsOptions) => {
					return parseLiterals(source, options);
				},
			);

			await minifyHTMLLiterals(SOURCE, {
				fileName: 'test.js',
				parseLiterals: customParseLiterals,
			});
			assert.ok(customParseLiterals.mock.callCount() > 0);
		});

		it('should allow custom shouldMinify()', async () => {
			const customShouldMinify = mock.fn((template: Template) => {
				return defaultShouldMinify(template);
			});

			await minifyHTMLLiterals(SOURCE, {
				fileName: 'test.js',
				shouldMinify: customShouldMinify,
			});
			assert.ok(customShouldMinify.mock.callCount() > 0);
		});

		it('should allow custom strategy', async () => {
			const customStrategy = {
				getPlaceholder: mock.fn((parts: TemplatePart[]) => {
					return defaultStrategy.getPlaceholder(parts);
				}),
				combineHTMLStrings: mock.fn(
					(parts: TemplatePart[], placeholder: string) => {
						return defaultStrategy.combineHTMLStrings(parts, placeholder);
					},
				),
				minifyHTML: mock.fn((html: string, options?: any) => {
					return defaultStrategy.minifyHTML(html, options);
				}),
				splitHTMLByPlaceholder: mock.fn((html: string, placeholder: string) => {
					return defaultStrategy.splitHTMLByPlaceholder(html, placeholder);
				}),
			};

			await minifyHTMLLiterals(SOURCE, {
				fileName: 'test.js',
				strategy: customStrategy,
			});
			assert.ok(customStrategy.getPlaceholder.mock.callCount() > 0);
			assert.ok(customStrategy.combineHTMLStrings.mock.callCount() > 0);
			assert.ok(customStrategy.minifyHTML.mock.callCount() > 0);
			assert.ok(customStrategy.splitHTMLByPlaceholder.mock.callCount() > 0);
		});

		it('should use defaultValidation', async () => {
			await assert.rejects(async () => {
				await minifyHTMLLiterals(SOURCE, {
					fileName: 'test.js',
					strategy: {
						getPlaceholder: () => {
							return '';
						},
						combineHTMLStrings: defaultStrategy.combineHTMLStrings,
						minifyHTML: defaultStrategy.minifyHTML,
						splitHTMLByPlaceholder: defaultStrategy.splitHTMLByPlaceholder,
					},
				});
			});

			await assert.rejects(async () => {
				await minifyHTMLLiterals(SOURCE, {
					fileName: 'test.js',
					strategy: {
						getPlaceholder: defaultStrategy.getPlaceholder,
						combineHTMLStrings: defaultStrategy.combineHTMLStrings,
						minifyHTML: defaultStrategy.minifyHTML,
						splitHTMLByPlaceholder: () => {
							return [];
						},
					},
				});
			});
		});

		it('should allow disabling validation', async () => {
			await assert.doesNotReject(async () => {
				await minifyHTMLLiterals(SOURCE, {
					fileName: 'test.js',
					strategy: {
						getPlaceholder: () => {
							return '';
						},
						combineHTMLStrings: defaultStrategy.combineHTMLStrings,
						minifyHTML: defaultStrategy.minifyHTML,
						splitHTMLByPlaceholder: defaultStrategy.splitHTMLByPlaceholder,
					},
					validate: false,
				});
			});
		});

		it('should allow custom validation', async () => {
			const customValidation = {
				ensurePlaceholderValid: mock.fn((placeholder: any) => {
					return defaultValidation.ensurePlaceholderValid(placeholder);
				}),
				ensureHTMLPartsValid: mock.fn(
					(parts: TemplatePart[], htmlParts: string[]) => {
						return defaultValidation.ensureHTMLPartsValid(parts, htmlParts);
					},
				),
			};

			await minifyHTMLLiterals(SOURCE, {
				fileName: 'test.js',
				validate: customValidation,
			});
			assert.ok(customValidation.ensurePlaceholderValid.mock.callCount() > 0);
			assert.ok(customValidation.ensureHTMLPartsValid.mock.callCount() > 0);
		});

		it('should allow disabling generateSourceMap', async () => {
			const result = await minifyHTMLLiterals(SOURCE, {
				fileName: 'test.js',
				generateSourceMap: false,
			});
			assert.ok(result && typeof result === 'object');
			assert.strictEqual(result!.map, undefined);
		});

		it('should allow custom generateSourceMap()', async () => {
			const customGenerateSourceMap = mock.fn(
				(ms: MagicStringLike, fileName: string) => {
					return defaultGenerateSourceMap(ms, fileName);
				},
			);

			await minifyHTMLLiterals(SOURCE, {
				fileName: 'test.js',
				generateSourceMap: customGenerateSourceMap,
			});
			assert.ok(customGenerateSourceMap.mock.callCount() > 0);
		});
	});

	describe('defaultGenerateSourceMap()', () => {
		it('should call generateMap() on MagicStringLike with .map file, source name, and hires', () => {
			const ms = new MagicStringLike();
			const originalGenerateMap = ms.generateMap.bind(ms);
			let capturedOptions: any;
			ms.generateMap = (options?: Partial<SourceMapOptions>) => {
				capturedOptions = options;
				return originalGenerateMap(options);
			};
			defaultGenerateSourceMap(ms, 'test.js');
			assert.deepStrictEqual(capturedOptions, {
				file: 'test.js.map',
				source: 'test.js',
				hires: true,
			});
		});
	});

	describe('defaultShouldMinify()', () => {
		it('should return true if the template is tagged with any "html" text', () => {
			assert.strictEqual(defaultShouldMinify({ tag: 'html', parts: [] }), true);
			assert.strictEqual(defaultShouldMinify({ tag: 'HTML', parts: [] }), true);
			assert.strictEqual(defaultShouldMinify({ tag: 'hTML', parts: [] }), true);
			assert.strictEqual(
				defaultShouldMinify({ tag: 'getHTML()', parts: [] }),
				true,
			);
			assert.strictEqual(
				defaultShouldMinify({ tag: 'templateHtml()', parts: [] }),
				true,
			);
		});

		it('should return false if the template is not tagged or does not contain "html"', () => {
			assert.strictEqual(defaultShouldMinify({ parts: [] }), false);
			assert.strictEqual(defaultShouldMinify({ tag: 'css', parts: [] }), false);
		});

		it('should return true if the template is tagged with any "svg" text', () => {
			assert.strictEqual(defaultShouldMinify({ tag: 'svg', parts: [] }), true);
			assert.strictEqual(defaultShouldMinify({ tag: 'SVG', parts: [] }), true);
			assert.strictEqual(defaultShouldMinify({ tag: 'sVg', parts: [] }), true);
			assert.strictEqual(
				defaultShouldMinify({ tag: 'getSVG()', parts: [] }),
				true,
			);
			assert.strictEqual(
				defaultShouldMinify({ tag: 'templateSvg()', parts: [] }),
				true,
			);
		});
	});

	describe('defaultShouldMinifyCSS()', () => {
		it('should return true if the template is tagged with any "css" text', () => {
			assert.strictEqual(
				defaultShouldMinifyCSS({ tag: 'css', parts: [] }),
				true,
			);
			assert.strictEqual(
				defaultShouldMinifyCSS({ tag: 'CSS', parts: [] }),
				true,
			);
			assert.strictEqual(
				defaultShouldMinifyCSS({ tag: 'csS', parts: [] }),
				true,
			);
			assert.strictEqual(
				defaultShouldMinifyCSS({ tag: 'getCSS()', parts: [] }),
				true,
			);
			assert.strictEqual(
				defaultShouldMinifyCSS({ tag: 'templateCss()', parts: [] }),
				true,
			);
		});

		it('should return false if the template is not tagged or does not contain "css"', () => {
			assert.strictEqual(defaultShouldMinifyCSS({ parts: [] }), false);
			assert.strictEqual(
				defaultShouldMinifyCSS({ tag: 'html', parts: [] }),
				false,
			);
		});
	});

	describe('defaultValidation', () => {
		describe('ensurePlaceholderValid()', () => {
			it('should throw an error if the placeholder is not a string', () => {
				assert.throws(() => {
					// @ts-expect-error testing invalid input
					defaultValidation.ensurePlaceholderValid();
				});
				assert.throws(() => {
					defaultValidation.ensurePlaceholderValid(true);
				});
				assert.throws(() => {
					defaultValidation.ensurePlaceholderValid({});
				});
			});

			it('should throw an error if the placeholder is an empty string', () => {
				assert.throws(() => {
					defaultValidation.ensurePlaceholderValid('');
				});
			});

			it('should not throw an error if the placeholder is a non-empty string', () => {
				assert.doesNotThrow(() => {
					defaultValidation.ensurePlaceholderValid('EXP');
				});
			});
		});
	});
});
