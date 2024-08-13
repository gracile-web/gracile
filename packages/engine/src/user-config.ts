import type { Connect } from 'vite';

/**
 * @example
 * `/vite.config.js`
 * ```js
 * import { gracile } from '@gracile/gracile/plugin';
 * import { defineConfig } from 'vite';
 *
 * export default defineConfig({
 * 	plugins: [
 * 		gracile({
 * 			output: 'server',
 *
 * 			dev: {
 * 				locals: (_context) => {
 * 					return {
 * 						requestId: crypto.randomUUID(),
 * 						userEmail: 'admin@admin.home.arpa',
 * 					};
 * 				},
 * 			},
 *
 *			routes: {
 *				exclude: ['**\/a-defective-route.ts'],
 *			},
 * 		}),
 * 	],
 * });
 * ```
 */
export interface GracileConfig {
	/**
	 * The target output for the build phase.
	 *
	 * See the [documentation](https://gracile.js.org/docs/learn/usage/output-modes/).
	 *
	 * @defaultValue 'static'
	 */
	output?: 'static' | 'server';

	/**
	 * Settings for the development mode.
	 */
	dev?: {
		/**
		 * Get incoming request context and apply locals for the Gracile request handler.
		 * Useful for mocking the production server.
		 *
		 * For `server` mode only.
		 */
		locals?: (context: { nodeRequest: Connect.IncomingMessage }) => unknown;
	};

	/**
	 * Settings for routes in `/src/routes`.
	 */
	routes?: {
		/**
		 * Exclude routes with an array of patterns. Useful for debugging.
		 */
		exclude?: string[];
	};
}
