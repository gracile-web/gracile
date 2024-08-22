import {
	render as renderLitSsr,
	type ServerRenderedTemplate,
} from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import type { TemplateResult } from 'lit';

/**
 * Just a tiny wrapper for `render` and `collectResult` from `@lit-labs/ssr`.
 *
 * Useful for testing server only partials.
 *
 * @example
 * ```js
 * import assert from 'node:assert';
 * import {
 * 	html,
 * 	type ServerRenderedTemplate,
 * } from '@gracile/gracile/server-html';
 *
 * const myServerTemplate1 = (): ServerRenderedTemplate => html`
 * 	<div>Hello</div>
 * `;
 *
 * const result = await renderLitTemplate(myServerTemplate1());
 *
 * assert.match(result, /Hello/);
 * ```
 */
export async function renderLitTemplate(
	template: ServerRenderedTemplate | TemplateResult<1>,
): Promise<string> {
	return collectResult(renderLitSsr(template));
}
