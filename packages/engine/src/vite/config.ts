import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';
import { mergeConfig, type UserConfig /* , type ViteDevServer */ } from 'vite';

import { isUnknownObject } from '../assertions.js';
import { GracileConfig } from '../user-config.js';

export async function getConfigs(root: string, mode: 'dev' | 'build') {
	const hmrPort = 8989 + Math.round(Math.random() * 100);
	// NOTE: This is a bit weird. May find a better way to treat HMR ports.
	// const tempConfigServer = await createServer();
	// const baseUserConfig = await tempConfigServer.ssrLoadModule('gracile.config');
	// tempConfigServer.close();

	// NOTE: Extension omitted so `tsx` choose automatically JS or TS.
	// Also, beware with absolute paths with Windows. They need the `file://` protocol.
	const userConfigGracile = await import(
		/* @vite-ignore */
		pathToFileURL(path.join(root, 'gracile.config')).href
	)
		.then((module: unknown) => {
			if (isUnknownObject(module) && typeof module['default'] === 'function') {
				const config = module['default'](GracileConfig) as unknown;
				if (config instanceof GracileConfig) return config;
			}

			logger.error(c.yellow('Wrong user config.'));
			return null;
		})
		.catch(() => {
			logger.error(c.yellow('Warning: Wrong or no user config detected.'));

			return null;
		});

	// NOTE: Harmonize `import.meta.env.(MODE|DEV|PROD)`
	// See https://vitejs.dev/guide/api-javascript#createserver
	if (mode === 'build') process.env['NODE_ENV'] = 'production';

	const baseConfigVite = {
		root,

		mode: mode === 'dev' ? 'development' : 'production',

		server:
			mode === 'dev'
				? // NOTE: Same (for now)
					{
						middlewareMode: true,
						hmr: { port: hmrPort },
					}
				: {
						middlewareMode: true,
						hmr: { port: hmrPort },
					},

		appType: 'custom',

		envPrefix: 'GRACILE',

		css: {
			devSourcemap: true,
		},

		// NOTE: Suppress the "Could not auto-determine entry point…" message
		optimizeDeps: {
			include: [],
		},

		plugins: [],

		resolve: {
			// TODO: Suppress message "Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information."
			// conditions: mode === 'dev' ? ['development'] : ['production'],
			// preserveSymlinks: true,
			// conditions: ['development', 'default'],
		},
	} satisfies UserConfig;

	const userConfigVite = userConfigGracile?.vite || {};

	const finalCommonConfigVite = mergeConfig(userConfigVite, baseConfigVite);
	return {
		userConfigGracile,

		baseConfigVite,
		userConfigVite,

		finalCommonConfigVite,
	};
}
