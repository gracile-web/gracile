import type { Plugin } from 'vite';

import { GLOBAL_STYLES_CE_SCRIPT } from './provider.js';

/**
 * Gracile Vite plugin for global styles adoption in Shadow DOM.
 *
 * Auto-injects the `<adopt-global-styles>` CE definition `<script>` into
 * every page's `<head>` via `transformIndexHtml`.
 *
 * Then use `<adopt-global-styles></adopt-global-styles>` inside any
 * Shadow Root to adopt all light-DOM stylesheets.
 *
 * @example
 *
 * ```ts
 * import { gracile } from '@gracile/gracile/plugin';
 * import { globalStylesAdopter } from '@gracile-labs/css-helpers/global/vite';
 * import { defineConfig } from 'vite';
 *
 * export default defineConfig({
 *   plugins: [gracile(), globalStylesAdopter()],
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function globalStylesAdopter(): any {
	return {
		name: 'gracile-global-styles-adopter',

		transformIndexHtml: {
			order: 'post',
			handler() {
				return [
					{
						tag: 'script',
						children: GLOBAL_STYLES_CE_SCRIPT,
						injectTo: 'head',
					},
				];
			},
		},
	} as const satisfies Plugin;
}
