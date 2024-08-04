import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { logger } from '@gracile/internal-utils/logger';
import { rename, rm } from 'fs/promises';
import c from 'picocolors';
import { build, createServer, type Plugin } from 'vite';

import {
	type RenderedRouteDefinition /* renderRoutes */,
} from './build/static.js';
import { createDevHandler } from './dev/dev.js';
import type { RoutesManifest } from './routes/route.js';
import { nodeAdapter } from './server/node.js';
import type { GracileConfig } from './user-config.js';
import { buildRoutes } from './vite/plugins/build-routes.js';
import { virtualRoutes } from './vite/plugins/virtual-routes.js';

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gracile = (config?: GracileConfig): any /* Plugin */[] => {
	const outputMode = config?.output || 'static';

	const clientAssets: Record<string, string> = {};

	let routes: RoutesManifest | null = null;
	let renderedRoutes: RenderedRouteDefinition[] | null = null;

	let root: string | null = null;

	const gracileConfig = config || {};

	return [
		{
			name: 'vite-plugin-gracile-serve-middleware',

			apply: 'serve',

			config() {
				return {
					// NOTE: Supresses message: `Could not auto-determine entry point from rollupOptions or html files…`
					optimizeDeps: { include: [] },
				};
			},

			async configureServer(server) {
				// Infos
				const mainPjson = fileURLToPath(
					new URL('../../gracile/package.json', import.meta.url),
				);
				const { version } = JSON.parse(await readFile(mainPjson, 'utf-8')) as {
					version: number;
				};
				logger.info(
					`${c.cyan(c.italic(c.underline('🧚 Gracile ')))}` +
						` ${c.green(` v${version}`)}`,
				);
				// ---

				const { handler } = await createDevHandler({
					vite: server,
					gracileConfig,
				});

				return () => {
					server.middlewares.use((req, res, next) => {
						const locals = config?.dev?.locals?.({ nodeRequest: req });
						Promise.resolve(nodeAdapter(handler)(req, res, locals)).catch(
							(error) => next(error),
						);
					});
				};
			},
		},

		{
			name: 'vite-plugin-gracile-build',

			apply: 'build',
			async config(viteConfig) {
				const viteServerForClientHtmlBuild = await createServer({
					// configFile: false,
					root: viteConfig.root || process.cwd(),
				});

				const htmlPages = await buildRoutes({
					viteServerForBuild: viteServerForClientHtmlBuild,
					root: viteConfig.root || process.cwd(),
					gracileConfig,
					serverMode: outputMode === 'server',
				});

				routes = htmlPages.routes;
				renderedRoutes = htmlPages.renderedRoutes;

				await viteServerForClientHtmlBuild.close();

				return {
					plugins: viteServerForClientHtmlBuild.config.plugins.filter(
						(p) => p.name,
					),
					build: {
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

				Object.entries(bundle).forEach(([, file]) => {
					if (file.type === 'asset' && file.name)
						clientAssets[file.name] = file.fileName;
				});
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
					configFile: false,

					root: root || process.cwd(),

					ssr: {
						external: ['@gracile/gracile'],
					},

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

							// external: ['@gracile/gracile'],

							// FIXME: ~~MUST import css from client somewhere.~~
							// ~~Hack could be using dynamic imports on client, so asset is picked up~~
							output: {
								entryFileNames: '[name].js',
								// assetFileNames: 'assets/[name].[ext]',
								// NOTE: Useful for, e.g., link tag with `?url`
								assetFileNames: (chunkInfo) => {
									if (chunkInfo.name) {
										//  (chunkInfo);
										const fileName = clientAssets[chunkInfo.name];
										if (fileName) return fileName;
										// NOTE: When not imported at all from client
										return `assets/${chunkInfo.name.replace(/\.(.*)$/, '')}-[hash].[ext]`;
									}

									// throw new Error(`Not client asset`);
									return 'assets/[name]-[hash].[ext]';
								},
								chunkFileNames: 'chunk/[name].js',
							},
						},
					},

					plugins: [
						virtualRoutes({
							routes,
							renderedRoutes,
						}),

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
import { createGracileMiddleware } from '@gracile/gracile/plugin';

//  ({ routeAssets, routeImports, routes })

export const handler = createGracileMiddleware({
	root: process.cwd(),
	routes,
	routeImports,
	routeAssets,
	serverMode: true,
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
	] satisfies Plugin[];
};
