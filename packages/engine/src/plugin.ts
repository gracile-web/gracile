import { createLogger } from '@gracile/internal-utils/logger/helpers';
import {
	getPluginContext,
	type PluginContext,
} from '@gracile/internal-utils/plugin-context';
import type { PluginOption } from 'vite';

import type { GracileConfig } from './user-config.js';
import { htmlRoutesLoader } from './vite/html-routes.js';
import { hmrSsrReload } from './vite/hmr.js';
import { virtualRoutesClient } from './vite/virtual-routes.js';
import { createPluginSharedState } from './vite/plugin-shared-state.js';
import { gracileServePlugin } from './vite/plugin-serve.js';
import { gracileClientBuildPlugin } from './vite/plugin-client-build.js';
import {
	gracileCollectClientAssetsPlugin,
	gracileServerBuildPlugin,
} from './vite/plugin-server-build.js';

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

	// HACK: Prevent duplicate client build for the SSR build step in server mode.
	// TODO: Move to the new, clean, environments builders API.
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
			},
		},

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

		// MARK: 8. Server build (nested)
		gracileServerBuildPlugin({
			state,
			virtualRoutesForClient,
		}),
	] satisfies PluginOption;
};

export type { GracileConfig } from './user-config.js';
