import { logger } from '@gracile/internal-utils/logger';
import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import c from 'picocolors';
import { build, mergeConfig, type UserConfig } from 'vite';

import { getConfigs } from './config.js';
import { htmlStaticPages } from './plugins/html-static-pages.js';
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

	const htmlPages = await htmlStaticPages(
		viteServerForBuild,
		root,
		userConfigGracile || {},
	);

	const buildConfig = {
		root,
		optimizeDeps: { include: [] },
		css: {
			devSourcemap: true,
		},
		plugins: [],

		build: {
			// IDEA: Make it overridable?
			sourcemap: true,

			rollupOptions: {
				// NOTE: Cannot be set in a plugin
				input: htmlPages.inputList,

				plugins: [htmlPages.plugin],
			},
		},
	} satisfies UserConfig;

	const finalConfig = mergeConfig(finalCommonConfigVite, buildConfig);
	await build(finalConfig);

	await viteServerForBuild.close().catch((e) => logger.error(String(e)));

	logger.warn('Exiting');

	// NOTE: Sometimes it's needed, sometimes it break some stuff
	// TODO: Find the good condition for all case (during tests, etc.)
	// process.exit();
}
