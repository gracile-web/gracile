import { relative } from 'node:path';

import {
	getPluginContext,
	type PluginContext,
} from '@gracile/internal-utils/plugin-context';
import type { Plugin, ResolvedConfig } from 'vite';

import {
	DedupLitElementRenderer,
	GRACILE_SRC_MARKER,
} from './dedup-renderer.js';

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
	let viteConfig: ResolvedConfig;

	return [
		{
			name: 'gracile-dsd-style-dedup-context',
			enforce: 'pre',

			config(resolvedConfig) {
				sharedPluginContext = getPluginContext(resolvedConfig);

				// Register module specifier so the production server build
				// can generate a proper import instead of JSON-serialising
				// the class reference.
				sharedPluginContext.rendererModules.push({
					importSpecifier: '@gracile-labs/css-helpers/shared/dedup-renderer',
					exportName: 'DedupLitElementRenderer',
				});
			},

			configResolved(resolved) {
				viteConfig = resolved;
			},

			configureServer() {
				if (!sharedPluginContext)
					throw new ReferenceError('Shared plugin context not found');

				sharedPluginContext.litSsrRenderInfo.elementRenderers.unshift(
					DedupLitElementRenderer,
				);
			},

			transform(code, id) {
				if (!id.endsWith('.css?inline')) return;

				const filePath = id.replace(/\?inline$/, '');
				const sourcePath =
					'/' + relative(viteConfig.root, filePath).replaceAll('\\', '/');

				return `/*! ${GRACILE_SRC_MARKER}${sourcePath} */\n${code}`;
			},
		} as const,
	] as Plugin[];
}
