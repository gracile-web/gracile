import { logger } from '@gracile/internal-utils/logger';
import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import c from 'picocolors';
import { build, mergeConfig, type UserConfig } from 'vite';

import { DEFAULT_USER_SERVER_MODULE_ENTRYPOINT } from '../dev/server.js';
import { routes } from '../routes/collect.js';
import { getConfigs } from './config.js';
import { buildRoutes } from './plugins/build-routes.js';
import { virtualRoutes } from './plugins/virtual-routes.js';
import { createViteServer } from './server.js';

export async function viteBuild(root = process.cwd()) {
	setCurrentWorkingDirectory(root);

	logger.info(`${c.dim(`Project root:`)} ${root}\n`);

	// SHOULD BE Vite for SSR?
	const viteServerForBuild = await createViteServer(root, 'build');

	const { userConfigGracile, finalCommonConfigVite } = await getConfigs(
		root,
		'build',
	);

	const serverMode = userConfigGracile?.output === 'server';

	const htmlPages = await buildRoutes({
		viteServerForBuild,
		root,
		_config: userConfigGracile || {},
		serverMode,
	});

	const baseBuildConfig = {
		root,
		optimizeDeps: { include: [] },
		css: {
			devSourcemap: true,
		},
		plugins: [],

		build: {
			// IDEA: Make it overridable?
			sourcemap: true,
		},
	} satisfies UserConfig;

	const finalConfig = mergeConfig(finalCommonConfigVite, baseBuildConfig);

	const clientConfig = mergeConfig(finalConfig, {
		build: {
			rollupOptions: {
				// NOTE: Cannot be set in a plugin
				input: htmlPages.inputList,
				plugins: [htmlPages.plugin],

				// input: {
				// 	server:
				// 		'src/server.ts' /* DEFAULT_USER_SERVER_MODULE_ENTRYPOINT + '.ts' */,
				// },
				output: {
					...(serverMode ? { dir: `${root}/dist/client` } : {}),
				},
			},
		},
		// resolve: {
		// 	preserveSymlinks: true,
		// 	conditions: ['development'],
		// },
	} satisfies UserConfig);

	await build(clientConfig);

	if (serverMode) {
		const serverConfig = mergeConfig(finalConfig, {
			publicDir: false,
			ssr: {
				// external: ['*node_modules*'],
				// noExternal
			},

			resolve: {
				// preserveSymlinks: true,
				// conditions: ['development'],
				// conditions: ['production'],
			},
			build: {
				ssr: true,

				rollupOptions: {
					external: [
						// '*',
						// '!*',
						// '*node_modules*',
						// 'node_modules/@gracile/gracile',
						// 'fsevents',
						// 'express',
						// 'vite',
						// '@whatwg-node/server',
						// '@lit/*',
						// '@lit-labs/*',
						// 'lit',
						// 'lit-html',
						// 'cheerio',
						// 'parse5',
					],

					plugins: [
						virtualRoutes({
							// root,
							routes,
							renderedRoutes: htmlPages.renderedRoutes,
						}),
					],
					input: {
						server: DEFAULT_USER_SERVER_MODULE_ENTRYPOINT,
					},

					output: {
						dir: `${root}/dist/server`,
						entryFileNames: '[name].js',
						assetFileNames: 'assets/[name].js',
						chunkFileNames: 'chunk/[name].js',
					},
				},
			},
		} satisfies UserConfig);
		await build(serverConfig);
	}

	await viteServerForBuild.close().catch((e) => logger.error(String(e)));

	logger.warn('Exiting');

	// NOTE: Sometimes it's needed, sometimes it break some stuff
	// TODO: Find the good condition for all case (during tests, etc.)
	// process.exit();
}
