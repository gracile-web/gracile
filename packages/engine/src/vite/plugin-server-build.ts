/**
 * Vite plugins: server-side build pipeline.
 *
 * Uses the Vite Environment API (`builder.buildApp()`) to coordinate
 * client and SSR builds instead of a nested `build()` call.
 *
 * Includes:
 * - Client asset filename collector (client env writeBundle)
 * - Virtual entrypoint codegen (SSR env only)
 * - Server-to-client asset mover (SSR env only)
 *
 * @internal
 */

import { join } from 'node:path';
import { rename, rm } from 'node:fs/promises';

import type { PluginOption } from 'vite';

import type { PluginSharedState } from './plugin-shared-state.js';

// ── Client asset collector ───────────────────────────────────────────

/**
 * Tracks client bundle assets so the server build can reference them
 * with their hashed filenames.
 */
export function gracileCollectClientAssetsPlugin({
	state,
}: {
	state: PluginSharedState;
}): PluginOption {
	return {
		name: 'vite-plugin-gracile-collect-client-assets-for-server',

		applyToEnvironment(environment) {
			return environment.name !== 'ssr';
		},

		writeBundle(_, bundle) {
			if (state.outputMode === 'static') return;

			for (const file of Object.values(bundle))
				if (file.type === 'asset' && file.name)
					state.clientAssets[file.name] = file.fileName;
		},
	} as const;
}

// ── Virtual entrypoint ───────────────────────────────────────────────

/**
 * Generates the virtual `entrypoint.js` module for the server build.
 * This is the server's main entry: it imports routes and creates the
 * Gracile handler.
 *
 * Scoped to the SSR environment via `applyToEnvironment`.
 */
export function gracileEntrypointPlugin({
	state,
}: {
	state: PluginSharedState;
}): PluginOption {
	return {
		name: 'vite-plugin-gracile-entry',
		apply: 'build',

		applyToEnvironment(environment) {
			return environment.name === 'ssr';
		},

		resolveId(id) {
			if (id === 'entrypoint.js') {
				return id;
			}
			return null;
		},

		load(id) {
			if (id === 'entrypoint.js' && state.routes && state.renderedRoutes) {
				return `
import { routeAssets, routeImports, routes } from 'gracile:routes';
import { createGracileHandler } from '@gracile/gracile/_internals/server-runtime';
import { createLogger } from '@gracile/gracile/_internals/logger';

createLogger();

export const handler = createGracileHandler({
	root: process.cwd(),
	routes,
	routeImports,
	routeAssets,
	serverMode: true,
	gracileConfig: ${JSON.stringify(state.gracileConfig, null, 2)}
});
`;
			}
			return null;
		},
	} as const;
}

// ── Server asset mover ───────────────────────────────────────────────

/**
 * After the server build writes its bundle, move any assets from
 * `dist/server/assets/` into `dist/client/assets/` so the client
 * can serve them.
 *
 * Scoped to the SSR environment via `applyToEnvironment`.
 */
export function gracileMoveServerAssetsPlugin({
	state,
}: {
	state: PluginSharedState;
}): PluginOption {
	return {
		name: 'gracile-move-server-assets',
		apply: 'build',

		applyToEnvironment(environment) {
			return environment.name === 'ssr';
		},

		async writeBundle(_, bundle) {
			const cwd = state.root || process.cwd();

			await Promise.all(
				Object.entries(bundle).map(async ([file]) => {
					if (file.startsWith('assets/') === false) return;
					await rename(
						join(cwd, `/dist/server/${file}`),
						join(cwd, `/dist/client/${file}`),
					);
				}),
			);
			// NOTE: Disabled for now, because it conflict with test's folder comparer
			await rm(join(cwd, `/dist/server/assets`), {
				recursive: true,
			}).catch(() => null);
		},
	} as const;
}
