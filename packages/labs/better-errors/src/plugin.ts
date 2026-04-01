import type { PluginOption } from 'vite';

import { patchOverlay } from './overlay.js';

const VITE_PLUGIN_NAME = 'vite-plugin-gracile-better-errors';

/**
 * Vite plugin that replaces Vite's built-in error overlay with a
 * Gracile-branded overlay featuring enhanced error metadata
 * (title, hint, docs link, highlighted code).
 *
 * @returns Vite plugins. `any` is used to prevent Vite typings version mismatches.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function betterErrors(): any[] {
	return [
		{
			name: VITE_PLUGIN_NAME,
			enforce: 'pre',

			apply: 'serve',

			transform(code, id, options) {
				if (options?.ssr) return null;
				if (!id.includes('vite/dist/client/client.mjs')) return null;

				// Replace the Vite overlay with ours
				return patchOverlay(code);
			},
		} satisfies PluginOption,
	];
}
