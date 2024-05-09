/**
 * Useful for tricking various languages IDE extensions.
 *
 * For syntax highlighting, formatting with Prettier, static analysis…
 *
 * This will just do string concatenation, plus auto-joining if a string array
 * is provided inside a template interpolation.
 */
export function dummyLiteral(
	templateStrings: TemplateStringsArray,
	...args: (string | string[])[]
): string {
	return templateStrings
		.map(
			(templateString, index) =>
				templateString +
				// TODO: Fix types
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				(Array.isArray(args[index]) ? args[index].join('') : args[index] || ''),
		)
		.join('');
}

/**
 * ```ts
 * const myJs = js`
 * console.log('Hello');
 * `;
 * ```
 *
 * VSCode extension: `icanhasjonas.vscode-js-template-literal`
 */
export const js = dummyLiteral;

/**
 * ```ts
 * const myMd = md`
 * # Hello
 * `;
 * ```
 */
export const md = dummyLiteral;

/**
 * ```ts
 * const myHtml = html`
 * <span>Hello</span>
 * `;
 * ```
 *
 * VSCode extension: `bierner.lit-html`
 *
 * \> [!TIP]
 * \> You might want also to checkout [Lit server-side only `html` template rendering](https://github.com/lit/lit/tree/350147d608cc34fe926dd2bced0e25748c726c59/packages/labs/ssr#server-only-templates).
 */
export const html = dummyLiteral;

/**
 * ```ts
 * const myCss = css`
 * .hello {
 * 	font-weight: 700;
 * }
 * `;
 * ```
 *
 * VSCode extension: `bierner.lit-html`
 */
export const css = dummyLiteral;

/**
 * Very useful for **inline styles**.
 *
 * \> [!TIP]
 * \> We just need a `styled.div` for our dummy literal, and for the Styled extension to pick-up
 * \> and **highlight** / **format** / get **insights** from inline CSS.
 * \>
 * \> Checkout `styled-components.vscode-styled-components` on the VS Code marketplace.
 *
 * VSCode extension: `styled-components.vscode-styled-components`
 *
 * ```ts
 * const myStyle = styled.div`
 * 	font-weight: 700;
 * 	font-size: 70px;
 * 	color: white;
 * `;
 * ```
 */
export const styled = { div: dummyLiteral };
