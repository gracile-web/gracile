/**
 * Vite plugins: server-side build pipeline.
 *
 * After the client build completes, these plugins run a nested
 * `vite build` in SSR mode to produce the server entrypoint.
 *
 * Includes:
 * - Client asset filename collector (from the client writeBundle)
 * - Server build trigger (closeBundle)
 * - Virtual entrypoint codegen
 * - Server-to-client asset mover
 *
 * @internal
 */

import { join } from 'node:path';
import { rename, rm } from 'node:fs/promises';

import { build, type PluginOption } from 'vite';

import { virtualRoutes } from './virtual-routes.js';
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

		writeBundle(_, bundle) {
			if (state.outputMode === 'static') return;

			for (const file of Object.values(bundle))
				if (file.type === 'asset' && file.name)
					state.clientAssets[file.name] = file.fileName;
		},
	};
}

// ── Server build trigger ─────────────────────────────────────────────

/**
 * After the client build finishes (`closeBundle`), run a nested SSR
 * build that produces the server entrypoint and moves assets back into
 * the client output directory.
 */
export function gracileServerBuildPlugin({
	state,
	virtualRoutesForClient,
}: {
	state: PluginSharedState;
	virtualRoutesForClient: PluginOption;
}): PluginOption {
	return {
		name: 'vite-plugin-gracile-server-build',
		apply: 'build',

		config(viteConfig) {
			state.root = viteConfig.root || null;
		},

		async closeBundle() {
			if (
				state.outputMode === 'static' ||
				!state.routes ||
				!state.renderedRoutes
			)
				return;

			const root = state.root || process.cwd();

			await build({
				root,

				ssr: { external: ['@gracile/gracile'] },

				build: {
					target: 'esnext',

					ssr: true,

					copyPublicDir: false,
					outDir: 'dist/server',
					ssrEmitAssets: true,
					cssMinify: true,
					cssCodeSplit: true,

					rollupOptions: {
						input: 'entrypoint.js',

						output: {
							entryFileNames: '[name].js',
							assetFileNames: (chunkInfo) => {
								if (chunkInfo.name) {
									const fileName = state.clientAssets[chunkInfo.name];
									if (fileName) return fileName;
									// NOTE: When not imported at all from client
									return `assets/${chunkInfo.name.replace(/\.(.*)$/, '')}-[hash].[ext]`;
								}

								return 'assets/[name]-[hash].[ext]';
							},
							chunkFileNames: 'chunk/[name].js',
						},
					},
				},

				plugins: [
					virtualRoutesForClient,

					virtualRoutes({
						routes: state.routes,
						renderedRoutes: state.renderedRoutes,
					}),

					gracileEntrypointPlugin(state),
					gracileMoveServerAssetsPlugin(state),
				],
			});
		},
	};
}

// ── Virtual entrypoint ───────────────────────────────────────────────

/**
 * Generates the virtual `entrypoint.js` module for the server build.
 * This is the server's main entry: it imports routes and creates the
 * Gracile handler.
 */
function gracileEntrypointPlugin(state: PluginSharedState): PluginOption {
	return {
		name: 'vite-plugin-gracile-entry',

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
	};
}

// ── Server asset mover ───────────────────────────────────────────────

/**
 * After the server build writes its bundle, move any assets from
 * `dist/server/assets/` into `dist/client/assets/` so the client
 * can serve them.
 */
function gracileMoveServerAssetsPlugin(state: PluginSharedState): PluginOption {
	return {
		name: 'gracile-move-server-assets',
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
	};
}
