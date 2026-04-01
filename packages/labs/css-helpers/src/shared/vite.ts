import {
	getPluginContext,
	type PluginContext,
} from '@gracile/internal-utils/plugin-context';
import type { Plugin } from 'vite';

import { DedupLitElementRenderer } from './dedup-renderer.js';
import { SHARED_STYLE_CE_SCRIPT } from './shared-style-provider.js';

/**
 * Gracile Vite plugin for DSD style deduplication.
 *
 * - Auto-registers `DedupLitElementRenderer` into Gracile's SSR pipeline
 *   (via the shared plugin context, same as Islands).
 * - Auto-injects the `<adopt-shared-style>` CE definition `<script>` into
 *   every page's `<head>` via `transformIndexHtml`.
 *
 * @example
 *
 * ```ts
 * import { gracile } from '@gracile/gracile/plugin';
 * import { dsdStyleDedup } from '@gracile-labs/css-helpers/plugin';
 * import { defineConfig } from 'vite';
 *
 * export default defineConfig({
 *   plugins: [gracile(), dsdStyleDedup()],
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dsdStyleDedup(): any[] {
	let sharedPluginContext: PluginContext | undefined;

	return [
		{
			name: 'gracile-dsd-style-dedup-context',
			enforce: 'pre',

			config(resolvedConfig) {
				sharedPluginContext = getPluginContext(resolvedConfig);
			},

			configureServer() {
				if (!sharedPluginContext)
					throw new ReferenceError('Shared plugin context not found');

				sharedPluginContext.litSsrRenderInfo.elementRenderers.unshift(
					DedupLitElementRenderer,
				);
			},
		} as const,

		{
			name: 'gracile-dsd-style-dedup-html',

			transformIndexHtml: {
				order: 'post',
				handler() {
					return [
						{
							tag: 'script',
							children: SHARED_STYLE_CE_SCRIPT,
							injectTo: 'head',
						},
					];
				},
			},
		} as const,
	] as Plugin[];
}
