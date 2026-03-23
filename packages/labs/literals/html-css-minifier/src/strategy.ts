/* eslint-disable @typescript-eslint/no-explicit-any */
import { minify, type MinifierOptions } from 'html-minifier-next';
import { transform, type TransformOptions } from 'lightningcss';
import type { TemplatePart } from '@literals/parser';

import { stripTypeScriptInScripts } from './strip-types.js';

/**
 * A strategy on how to minify HTML and optionally CSS.
 *
 * @template O minify HTML options
 * @template C minify CSS options
 */
export interface Strategy<O = any, C = any> {
	/**
	 * Retrieve a placeholder for the given array of template parts. The
	 * placeholder returned should be the same if the function is invoked with the
	 * same array of parts.
	 *
	 * The placeholder should be an HTML-compliant string that is not present in
	 * any of the parts' text.
	 *
	 * @param parts the parts to get a placeholder for
	 * @returns the placeholder
	 */
	getPlaceholder(parts: TemplatePart[]): string;
	/**
	 * Combines the parts' HTML text strings together into a single string using
	 * the provided placeholder. The placeholder indicates where a template
	 * expression occurs.
	 *
	 * @param parts the parts to combine
	 * @param placeholder the placeholder to use between parts
	 * @returns the combined parts' text strings
	 */
	combineHTMLStrings(parts: TemplatePart[], placeholder: string): string;
	/**
	 * Minfies the provided HTML string.
	 *
	 * @param html the html to minify
	 * @param options html minify options
	 * @returns minified HTML string
	 */
	minifyHTML(html: string, options?: O): Promise<string>;
	/**
	 * Minifies the provided CSS string.
	 *
	 * @param css the css to minfiy
	 * @param options css minify options
	 * @returns minified CSS string
	 */
	minifyCSS?(css: string, options?: C): string;
	/**
	 * Splits a minfied HTML string back into an array of strings from the
	 * provided placeholder. The returned array of strings should be the same
	 * length as the template parts that were combined to make the HTML string.
	 *
	 * @param html the html string to split
	 * @param placeholder the placeholder to split by
	 * @returns an array of html strings
	 */
	splitHTMLByPlaceholder(html: string, placeholder: string): string[];
}

/**
 * CSS minification options for <code>lightningcss</code>.
 */
export type MinifyCSSOptions = Omit<
	TransformOptions<never>,
	'filename' | 'code' | 'minify'
>;

/**
 * The default <code>lightningcss</code> options.
 */
export const defaultMinifyCSSOptions: MinifyCSSOptions = {};

/**
 * The default <code>html-minifier-next</code> options, optimized for production
 * minification.
 */
export const defaultMinifyOptions: MinifierOptions = {
	caseSensitive: true,
	collapseWhitespace: true,
	decodeEntities: true,
	minifyCSS: false,
	minifyJS: true,
	processConditionalComments: true,
	removeAttributeQuotes: false,
	removeComments: true,
	removeEmptyAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	useShortDoctype: true,
};

/**
 * Derives a valid custom element tag placeholder from the main placeholder.
 * Used when a template expression appears in tag-name position (e.g. `<${tag}>`).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTagPlaceholder(_placeholder: string): string {
	return 'template-expression-tag';
}

/**
 * The default strategy. This uses <code>html-minifier-next</code> to minify
 * HTML and <code>lightningcss</code> to minify CSS.
 */
export const defaultStrategy: Strategy<MinifierOptions, MinifyCSSOptions> = {
	getPlaceholder(parts) {
		// Using @ and (); will cause the expression not to be removed in CSS.
		// However, sometimes the semicolon can be removed (ex: inline styles).
		// In those cases, we want to make sure that the HTML splitting also
		// accounts for the missing semicolon.
		const suffix = '();';
		let placeholder = '@TEMPLATE_EXPRESSION';
		while (
			parts.some(
				(part) =>
					part.text.includes(placeholder + suffix) ||
					part.text.includes(getTagPlaceholder(placeholder + suffix)),
			)
		) {
			placeholder += '_';
		}

		return placeholder + suffix;
	},
	combineHTMLStrings(parts, placeholder) {
		const tagPlaceholder = getTagPlaceholder(placeholder);
		let result = '';
		for (let i = 0; i < parts.length; i++) {
			result += parts[i]!.text;
			if (i < parts.length - 1) {
				// Check if this part's text ends with `<` or `</`, meaning the
				// next expression is a tag name. Use a valid custom element name
				// so html-minifier-next can parse it.
				const trimmed = result.trimEnd();
				result +=
					trimmed.endsWith('<') || trimmed.endsWith('</')
						? tagPlaceholder
						: placeholder;
			}
		}
		return result;
	},

	async minifyHTML(html, options = {}) {
		let result = stripTypeScriptInScripts(html);

		result = await minify(result, {
			...options,
			// Minify CSS in <style> blocks and inline styles, but skip any
			// that contain template expression placeholders (which would be
			// corrupted by the CSS parser).
			minifyCSS: (css: string) => {
				if (css.includes('@TEMPLATE_EXPRESSION')) {
					return css;
				}
				try {
					const out = transform({
						filename: 'style.css',
						code: new TextEncoder().encode(css),
						minify: true,
					});
					return new TextDecoder().decode(out.code);
				} catch {
					return css;
				}
			},
		});

		if (options.collapseWhitespace) {
			// html-minifier does not support removing newlines inside <svg>
			// attributes. Support this, but be careful not to remove newlines from
			// supported areas (such as within <pre> and <textarea> tags).
			const matches = [...result.matchAll(/<svg/g)].toReversed();
			for (const match of matches) {
				const startTagIndex = match.index!;
				const closeTagIndex = result.indexOf('</svg', startTagIndex);
				if (closeTagIndex === -1) {
					// Malformed SVG without a closing tag
					continue;
				}

				const start = result.slice(0, Math.max(0, startTagIndex));
				let svg = result.slice(startTagIndex, closeTagIndex);
				const end = result.slice(Math.max(0, closeTagIndex));
				svg = svg.replaceAll(/\r?\n/g, '');
				result = start + svg + end;
			}
		}

		return result;
	},

	minifyCSS(css, options = {}) {
		const result = transform({
			filename: 'template.css',
			code: new TextEncoder().encode(css),
			minify: true,
			...options,
		});
		return new TextDecoder().decode(result.code);
	},

	splitHTMLByPlaceholder(html, placeholder) {
		const tagPlaceholder = getTagPlaceholder(placeholder);
		const parts = html.split(placeholder);
		// Make the last character (a semicolon) optional. See above.
		if (placeholder.endsWith(';')) {
			const withoutSemicolon = placeholder.slice(
				0,
				Math.max(0, placeholder.length - 1),
			);
			for (let index = parts.length - 1; index >= 0; index--) {
				parts.splice(index, 1, ...parts[index]!.split(withoutSemicolon));
			}
		}

		// Also split by the tag-name placeholder used for dynamic tag names.
		for (let index = parts.length - 1; index >= 0; index--) {
			parts.splice(index, 1, ...parts[index]!.split(tagPlaceholder));
		}

		return parts;
	},
};
