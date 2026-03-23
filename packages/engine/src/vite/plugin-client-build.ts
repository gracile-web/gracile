/**
 * Vite plugin: client-side build route rendering.
 *
 * During `vite build`, this spins up a temporary dev server to render
 * all routes into static HTML, then populates shared state with the
 * rendered routes and input list.
 *
 * The actual HTML route resolution and asset collection are handled by
 * separate Vite plugins (see `plugin-html-routes-build.ts`) that read
 * from shared state and use `applyToEnvironment` to scope to the client.
 *
 * @internal
 */

import { getPluginContext } from '@gracile/internal-utils/plugin-context';
import { createServer, type PluginOption } from 'vite';

import { buildRoutes } from './build-routes.js';
import type { PluginSharedState } from './plugin-shared-state.js';

export function gracileClientBuildPlugin({
	state,
	virtualRoutesForClient,
}: {
	state: PluginSharedState;
	virtualRoutesForClient: PluginOption;
}): PluginOption {
	return {
		name: 'vite-plugin-gracile-build',

		apply: 'build',

		async config(viteConfig) {
			state.root = viteConfig.root || process.cwd();

			const viteServerForClientHtmlBuild = await createServer({
				root: state.root,

				server: { middlewareMode: true },
				// NOTE: Stub. KEEP IT!
				optimizeDeps: { include: [] },

				plugins: [virtualRoutesForClient],
			});

			// NOTE: Important. Get the dev. server elements renderers.
			state.gracileConfig.litSsr ??= {};
			state.gracileConfig.litSsr.renderInfo = getPluginContext(
				viteServerForClientHtmlBuild.config,
			)?.litSsrRenderInfo;

			const htmlPages = await buildRoutes({
				viteServerForBuild: viteServerForClientHtmlBuild,
				root: viteConfig.root || process.cwd(),
				gracileConfig: state.gracileConfig,
				serverMode: state.outputMode === 'server',
				routes: state.routes,
			});

			state.renderedRoutes = htmlPages.renderedRoutes;
			state.clientBuildInputList = htmlPages.inputList;

			// NOTE: Vite's dev server does not invoke Rollup's `closeWatcher`
			// hook when shutting down. Plugins like @rollup/plugin-typescript
			// use `ts.createWatchProgram()` which sets up hundreds of FS
			// watchers; without an explicit `closeWatcher` call they are
			// leaked and the Node process hangs after build.
			for (const plugin of viteServerForClientHtmlBuild.config.plugins) {
				if (typeof plugin.closeWatcher === 'function') {
					await (
						plugin as { closeWatcher: () => void | Promise<void> }
					).closeWatcher();
				}
			}

			await viteServerForClientHtmlBuild.close();
		},
	} as const;
}
