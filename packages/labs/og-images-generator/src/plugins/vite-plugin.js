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
	// HACK: Returns as any to prevent Vite typings mismatches.
	return /** @type {import('vite').Plugin} */ ({
		...rollupOgImagesGenerator(options),

		configureServer: (server) => applyViteDevServerMiddleware(server),
	});
}
