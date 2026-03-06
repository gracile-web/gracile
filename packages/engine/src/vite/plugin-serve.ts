/**
 * Vite plugin: development server middleware.
 *
 * Sets up the Gracile request handler, route watcher, and dev-time
 * logging for `vite dev`.
 *
 * @internal
 */

import { getVersion } from '@gracile/internal-utils/version';
import c from 'picocolors';
import type { Logger, PluginOption } from 'vite';

import { createDevelopmentHandler } from '../dev/development.js';
import { nodeAdapter } from '../server/adapters/node.js';
import type { GracileConfig } from '../user-config.js';

import type { PluginSharedState } from './plugin-shared-state.js';

export function gracileServePlugin({
	state,
	config,
	logger,
	resetClientBuiltFlag,
}: {
	state: PluginSharedState;
	config: GracileConfig | undefined;
	logger: Logger;
	resetClientBuiltFlag: () => void;
}): PluginOption {
	return {
		name: 'vite-plugin-gracile-serve-middleware',

		apply: 'serve',

		config(_, environment) {
			if (environment.isPreview) return null;
			return {
				// NOTE: Supresses message: `Could not auto-determine entry point from rollupOptions or html files…`
				// FIXME: It's not working when reloading the Vite config.
				// Is user config, putting `optimizeDeps: { include: [] }` solve this.
				optimizeDeps: { include: [] },

				// NOTE: Useful? It breaks preview (expected)
				appType: 'custom',
			};
		},

		async configureServer(server) {
			// HACK: We know we are in dev here, this will prevent incorrect
			// vite.config hot reloading. Will be removed when adopting env. API.
			resetClientBuiltFlag();

			const version = getVersion();
			logger.info(
				`${c.cyan(c.italic(c.underline('🧚 Gracile')))}` +
					` ${c.dim(`~`)} ${c.green(`v${version ?? 'X'}`)}`,
			);

			const { handler } = await createDevelopmentHandler({
				routes: state.routes,
				vite: server,
				gracileConfig: state.gracileConfig,
			});

			logger.info(c.dim('Vite development server is starting…'), {
				timestamp: true,
			});

			server.watcher.on('ready', () => {
				setTimeout(() => {
					logger.info('');
					logger.info(c.green('Watching for file changes…'), {
						timestamp: true,
					});
					logger.info('');
					// NOTE: We want it to show after the Vite intro stuff
				}, 100);
			});

			return () => {
				server.middlewares.use((request, response, next) => {
					const locals = config?.dev?.locals?.({ nodeRequest: request });
					Promise.resolve(
						nodeAdapter(handler, { logger })(request, response, locals),
					).catch((error) => next(error));
				});
			};
		},
	};
}
