import {
	getPluginContext,
	type PluginContext,
} from '@gracile/internal-utils/plugin-context';
import {
	isRunnableDevEnvironment,
	type Plugin,
	type ViteDevServer,
} from 'vite';
import { createGracileViteLogger } from '@gracile/internal-utils/logger/vite-logger';

import { makeIslandRenderer } from './element-renderer.js';

// NOTE: Keep this for now, will be used for `server` output.
// const virtualModuleId = '/@gracile/generated-island-registry';
// const resolvedVirtualModuleId = '\0' + virtualModuleId;

const log = createGracileViteLogger();

async function reloadRegistry(server: ViteDevServer): Promise<void> {
	const ssrEnvironment = server.environments.ssr;
	if (!isRunnableDevEnvironment(ssrEnvironment))
		throw new Error('Not in a SSR path');

	try {
		registry.islands = await ssrEnvironment.runner
			.import('/islands.config.ts')
			.then((m) => m['default']);
	} catch {
		log.error(
			'Missing `islands.config.{js,ts}` file. No Gracile Islands loaded.',
			{ timestamp: true },
		);
	}
}

const registry = { islands: {} };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function gracileIslands(options?: { debug?: boolean }): any[] {
	const debug = options?.debug ?? false;

	let sharedPluginContext: PluginContext | undefined;

	return [
		{
			name: 'vite-plugin-gracile-context',
			enforce: 'pre',
			config(resolvedConfig) {
				sharedPluginContext = getPluginContext(resolvedConfig);

				return {
					resolve: {
						dedupe: [
							'react',
							'react-dom',
							'preact',
							'preact-render-to-string',
							'svelte',
							'vue',
							'solid-js',
						],
					},
				};
			},
		} as const,

		{
			enforce: 'pre',
			name: 'vite-plugin-gracile-island',

			// resolveId(id) {
			// 	if (id === virtualModuleId) return resolvedVirtualModuleId;
			// },

			handleHotUpdate({ file, server }) {
				if (debug)
					log.info(`Invalidating virtual module due to change in ${file}`, {
						timestamp: true,
					});
				// TODO: Finer grain trigger
				void reloadRegistry(server);
			},

			configureServer(server) {
				// HACK: For Vue plugin only.
				// Wait for the plugin or module graph to be ready, or it
				// will be corrupt and the .vue files will choke.
				queueMicrotask(async () => {
					if (!sharedPluginContext)
						throw new ReferenceError('Shared context not found');

					await reloadRegistry(server); // Initial

					sharedPluginContext.litSsrRenderInfo.elementRenderers.push(
						makeIslandRenderer(registry),
					);
				});
			},
		} as const,
	] as Plugin[];
}
