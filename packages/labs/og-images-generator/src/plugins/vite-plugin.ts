import type { ViteDevServer, PluginOption } from 'vite';

import {
	CONFIG_FILE_NAME,
	resolveConfigPath,
	normalizeUserConfig,
	type GenerateOgImagesOptions,
} from '../generate.js';

import {
	connectOgImagesGenerator,
	type ConfigReloader,
} from './connect-middleware.js';
import { rollupOgImagesGenerator } from './rollup-plugin.js';

export const applyViteDevServerMiddleware = async (
	server: ViteDevServer,
	options?: Pick<GenerateOgImagesOptions, 'config' | 'configPath'>,
): Promise<void> => {
	if (options?.config) {
		server.middlewares.use(
			await connectOgImagesGenerator({ config: options.config }),
		);
		return;
	}

	const viteConfigPath = `/@fs${resolveConfigPath(
		options?.configPath ?? `./${CONFIG_FILE_NAME}`,
	)}`;

	server.middlewares.use(
		await connectOgImagesGenerator({
			configReloader: (async () =>
				normalizeUserConfig(
					await server.ssrLoadModule(viteConfigPath),
				)) as unknown as ConfigReloader,
		}),
	);
};

export function viteOgImagesGenerator(
	options?: GenerateOgImagesOptions,
): PluginOption {
	let isBuild = false;

	const rollupPlugin = rollupOgImagesGenerator(options);

	// HACK: Returns as any to prevent Vite typings mismatches.
	return {
		...rollupPlugin,

		config(_config, env) {
			isBuild = env.command === 'build';
		},

		async closeBundle() {
			// Guard: only run during an actual production build.
			// Without this, the hook also fires when an internal
			// temporary dev server (created to pre-render routes) is closed,
			// causing duplicate OG image generation.
			if (!isBuild) return;
			// @ts-expect-error Unsafe call
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await rollupPlugin.closeBundle.call(this);
		},

		configureServer: (server) => applyViteDevServerMiddleware(server, options),
	} as const;
}
