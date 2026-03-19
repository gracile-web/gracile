import { createLogger } from '@gracile/internal-utils/logger/helpers';
import {
	getPluginContext,
	type PluginContext,
} from '@gracile/internal-utils/plugin-context';
import type { PluginOption, ViteBuilder } from 'vite';

import type { GracileConfig } from './user-config.js';
import { htmlRoutesLoader } from './vite/html-routes.js';
import { hmrSsrReload } from './vite/hmr.js';
import { virtualRoutesClient, virtualRoutes } from './vite/virtual-routes.js';
import { createPluginSharedState } from './vite/plugin-shared-state.js';
import { gracileServePlugin } from './vite/plugin-serve.js';
import { gracileClientBuildPlugin } from './vite/plugin-client-build.js';
import {
	gracileCollectClientAssetsPlugin,
	gracileEntrypointPlugin,
	gracileMoveServerAssetsPlugin,
} from './vite/plugin-server-build.js';
import { gracileCETrackerPlugin } from './vite/plugin-ce-tracker.js';

// When plugin-client-build creates a temporary dev server via createServer(),
// the user's vite.config is re-evaluated, calling gracile() again.
// This guard prevents that re-entrant call from initializing the full plugin set.
// Reset in configureServer so dev-mode config hot-reloads still work.
let isClientBuilt = false;

/**
 * The main Vite plugin for loading the Gracile framework.
 * @param config - Gracile configuration.
 * @returns Vite plugins. `any` is used to prevent Vite typings version mismatches for the plugin API.
 * @example
 * `/vite.config.js`
 * ```js
 * import { gracile } from '@gracile/gracile/plugin';
 * import { defineConfig } from 'vite';
 *
 * export default defineConfig({
 * 	plugins: [
 * 		gracile({ output: 'server' }),
 * 	],
 * });
 * ```
 */
// NOTE: for Vite versions mismatches with `exactOptionalPropertyTypes`?
// This `any[]` AND with a plugin -array- makes ESLint and TS shut up.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gracile = (config?: GracileConfig): any[] => {
	const logger = createLogger();

	const state = createPluginSharedState(config);

	if (isClientBuilt) return [];
	isClientBuilt = true;

	const virtualRoutesForClient = virtualRoutesClient({
		mode: state.outputMode,
		routes: state.routes,
		gracileConfig: state.gracileConfig,
	});

	let sharedPluginContext: PluginContext | undefined;

	return [
		// MARK: 1. Plugin context setup
		{
			name: 'vite-plugin-gracile-context',
			config(viteConfig) {
				sharedPluginContext = getPluginContext(viteConfig);

				state.gracileConfig.litSsr ??= { renderInfo: {} };
				state.gracileConfig.litSsr.renderInfo =
					sharedPluginContext.litSsrRenderInfo;

				// Environment API: configure SSR environment for server mode.
				if (state.outputMode === 'server') {
					return {
						ssr: { external: ['@gracile/gracile'] },

						environments: {
							ssr: {
								build: {
									outDir: 'dist/server',
									copyPublicDir: false,
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
													return `assets/${chunkInfo.name.replace(/\.(.*)$/, '')}-[hash].[ext]`;
												}
												return 'assets/[name]-[hash].[ext]';
											},
											chunkFileNames: 'chunk/[name].js',
										},
									},
								},
							},
						},
					};
				}
			},
		},

		// MARK: 1.5. CE registry tracker (dev HMR cleanup)
		gracileCETrackerPlugin(),

		// MARK: 2. HMR SSR reload
		hmrSsrReload(),

		// MARK: 3. Dev serve middleware
		gracileServePlugin({
			state,
			config,
			logger,
			resetClientBuiltFlag: () => {
				isClientBuilt = false;
			},
		}),

		// MARK: 4. Client virtual routes
		virtualRoutesForClient,

		// MARK: 5. HTML routes loader
		htmlRoutesLoader(),

		// MARK: 6. Client build
		gracileClientBuildPlugin({
			state,
			virtualRoutesForClient,
		}),

		// MARK: 7. Collect client assets for server
		gracileCollectClientAssetsPlugin({ state }),

		// MARK: 8. Server virtual routes (SSR environment only)
		...virtualRoutes({ state }),

		// MARK: 9. Server entrypoint (SSR environment only)
		gracileEntrypointPlugin({ state }),

		// MARK: 10. Move server assets (SSR environment only)
		gracileMoveServerAssetsPlugin({ state }),

		// MARK: 11. Build coordinator (server mode only)
		...(state.outputMode === 'server'
			? [
					{
						name: 'vite-plugin-gracile-build-coordinator',
						apply: 'build' as const,

						async buildApp(builder: ViteBuilder) {
							const client = builder.environments['client'];
							const ssr = builder.environments['ssr'];
							if (!client || !ssr)
								throw new Error('Missing client or ssr build environment.');

							await builder.build(client);
							await builder.build(ssr);
						},
					},
				]
			: []),
	] satisfies PluginOption;
};

export type { GracileConfig } from './user-config.js';
