import { join } from 'node:path';
import { rename, rm } from 'node:fs/promises';

import { createLogger } from '@gracile/internal-utils/logger/helpers';
import { getVersion } from '@gracile/internal-utils/version';
// import { betterErrors } from '@gracile-labs/better-errors/plugin';
import c from 'picocolors';
import { build, createServer, type PluginOption } from 'vite';

import {
	type RenderedRouteDefinition /* renderRoutes */,
} from './routes/render.js';
import { createDevelopmentHandler } from './dev/development.js';
import type { RoutesManifest } from './routes/route.js';
import { nodeAdapter } from './server/adapters/node.js';
import type { GracileConfig } from './user-config.js';
import { buildRoutes } from './vite/build-routes.js';
import { htmlRoutesLoader } from './vite/html-routes.js';
import { virtualRoutes, virtualRoutesClient } from './vite/virtual-routes.js';
import { hmrSsrReload } from './vite/hmr.js';

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

	const outputMode = config?.output || 'static';

	const clientAssets: Record<string, string> = {};

	const routes: RoutesManifest = new Map();

	let renderedRoutes: RenderedRouteDefinition[] | null = null;

	let root: string | null = null;

	const gracileConfig = config || ({} as GracileConfig);

	// NOTE: Prevent duplicate client build for the SSR build step in server mode.
	if (isClientBuilt) return [];
	isClientBuilt = true;

	const virtualRoutesForClient = virtualRoutesClient({
		mode: outputMode,
		routes,
		// NOTE: This will be a dedicated setting when it will not be experimental
		// anymore.
		gracileConfig,
		// enabled: gracileConfig?.pages?.premises?.expose || false,
	});

	return [
		// betterErrors({
		// 	overlayImportPath: '@gracile/gracile/_internals/vite-custom-overlay',
		// }),
		// 		{
		// 			name: 'gracile-routes-codegen',

		// 			// watchChange(change) {
		// 			// 	console.log({ change });
		// 			// },

		// 			resolveId(id) {
		// 				const virtualModuleId = 'gracile:route';
		// 				const resolvedVirtualModuleId = `\0${virtualModuleId}`;

		// 				if (id === virtualModuleId) {
		// 					return resolvedVirtualModuleId;
		// 				}
		// 				return null;
		// 			},

		// 			load(id) {
		// 				const virtualModuleId = 'gracile:route';
		// 				const resolvedVirtualModuleId = `\0${virtualModuleId}`;

		// 				if (id === resolvedVirtualModuleId) {
		// 					return `
		// export function route(input){
		// return input;
		// }`;
		// 				}
		// 				return null;
		// 			},
		// 		},

		hmrSsrReload(),

		{
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

					// resolve: {
					// 	conditions: ['development'],
					// },
				};
			},

			async configureServer(server) {
				// Infos

				// // NOTE: Beware import.meta.resolve is only compatible
				// // with v20.6.0 (without cli flag)and upward
				// // Not working with StackBlitz ATM?
				// const mainPjson = import.meta
				// 	.resolve('@gracile/gracile')
				// 	// NOTE: Weirdly, it will assume that it's `dist/**.js`,
				// 	// even after fiddling with pjson exports.
				// 	.replace('/dist/index.js', '/package.json');
				// const { version } = JSON.parse(
				// 	await readFile(new URL(mainPjson), 'utf-8'),
				// ) as {
				// 	version: number;
				// };
				const version = getVersion();
				logger.info(
					`${c.cyan(c.italic(c.underline('🧚 Gracile')))}` +
						` ${c.dim(`~`)} ${c.green(`v${version ?? 'X'}`)}`,
				);
				// ---

				const { handler } = await createDevelopmentHandler({
					routes,
					vite: server,
					gracileConfig,
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
		},

		virtualRoutesForClient,

		htmlRoutesLoader(),

		{
			name: 'vite-plugin-gracile-build',

			apply: 'build',

			async config(viteConfig) {
				const viteServerForClientHtmlBuild = await createServer({
					// configFile: false,
					root: viteConfig.root || process.cwd(),

					server: { middlewareMode: true },
					// NOTE: Stub. KEEP IT!
					optimizeDeps: { include: [] },

					plugins: [virtualRoutesForClient],
				});

				const htmlPages = await buildRoutes({
					viteServerForBuild: viteServerForClientHtmlBuild,
					root: viteConfig.root || process.cwd(),
					gracileConfig,
					serverMode: outputMode === 'server',
					routes,
				});

				renderedRoutes = htmlPages.renderedRoutes;

				await viteServerForClientHtmlBuild.close();

				return {
					build: {
						// ssrManifest: true,
						rollupOptions: {
							input: htmlPages.inputList,
							plugins: [htmlPages.plugin],
						},
						outDir: outputMode === 'server' ? 'dist/client' : 'dist',
					},
				};
			},
		},

		{
			name: 'vite-plugin-gracile-collect-client-assets-for-server',

			writeBundle(_, bundle) {
				if (outputMode === 'static') return;

				for (const file of Object.values(bundle))
					if (file.type === 'asset' && file.name)
						clientAssets[file.name] = file.fileName;
			},
		},

		{
			name: 'vite-plugin-gracile-server-build',
			apply: 'build',

			config(viteConfig) {
				root = viteConfig.root || null;
			},

			async closeBundle() {
				if (outputMode === 'static' || !routes || !renderedRoutes) return;

				await build({
					root: root || process.cwd(),

					ssr: { external: ['@gracile/gracile'] },

					build: {
						target: 'esnext',

						ssr: true,
						// ssrManifest: true,

						copyPublicDir: false,
						outDir: 'dist/server',
						ssrEmitAssets: true,
						cssMinify: true,
						cssCodeSplit: true,

						rollupOptions: {
							input: 'entrypoint.js',

							// external: ['@gracile/gracile'],

							// FIXME: ~~MUST import css from client somewhere.~~
							// ~~Hack could be using dynamic imports on client, so asset is picked up~~
							output: {
								entryFileNames: '[name].js',
								// assetFileNames: 'assets/[name].[ext]',
								// NOTE: Useful for, e.g., link tag with `?url`
								assetFileNames: (chunkInfo) => {
									if (chunkInfo.name) {
										const fileName = clientAssets[chunkInfo.name];
										if (fileName) return fileName;
										// NOTE: When not imported at all from client
										return `assets/${chunkInfo.name.replace(/\.(.*)$/, '')}-[hash].[ext]`;
									}

									// throw new Error(`Not a client asset`);
									return 'assets/[name]-[hash].[ext]';
								},
								chunkFileNames: 'chunk/[name].js',
							},
						},
					},

					plugins: [
						virtualRoutesForClient,

						virtualRoutes({ routes, renderedRoutes }),

						{
							name: 'vite-plugin-gracile-entry',

							resolveId(id) {
								if (id === 'entrypoint.js') {
									return id;
								}
								return null;
							},

							load(id) {
								if (id === 'entrypoint.js' && routes && renderedRoutes) {
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
	gracileConfig: ${JSON.stringify(gracileConfig, null, 2)}
});
`;
								}
								return null;
							},
						},
						{
							name: 'gracile-move-server-assets',
							async writeBundle(_, bundle) {
								const cwd = root || process.cwd();

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
						},
					],
				});
			},
		},
	] satisfies PluginOption;
};

export type { GracileConfig } from './user-config.js';
