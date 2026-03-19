import { connectOgImagesGenerator } from './connect-middleware.js';
import { rollupOgImagesGenerator } from './rollup-plugin.js';

/**
 * @param {import('vite').ViteDevServer} server
 */
export const applyViteDevServerMiddleware = async (server) => {
	server.middlewares.use(
		await connectOgImagesGenerator({
			configReloader:
				/** @type {import('./connect-middleware.js').ConfigReloader} */ (
					() => server.ssrLoadModule('./og-images.config.js')
				),
		}),
	);
};

/**
 * @param {import("../collect").PathsOptions} [options]
 * @returns {any}
 */
export function viteOgImagesGenerator(options) {
	let isBuild = false;

	const rollupPlugin = rollupOgImagesGenerator(options);

	// HACK: Returns as any to prevent Vite typings mismatches.
	return /** @type {import('vite').Plugin} */ ({
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

		configureServer: (server) => applyViteDevServerMiddleware(server),
	});
}
