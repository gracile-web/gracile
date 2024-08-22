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

	/**
	 * Settings for pages in `/src/routes`.
	 */
	pages?: {
		/**
		 * Premises are the document and the properties necessary for page template
		 * rendering.
		 *
		 * You can access them via:
		 *
		 * - `.../_my-route/__index.props.json`
		 * - `.../_my-route/__index.doc.html`
		 *
		 * They are accessible with the dev/server handler and are outputted as
		 * static files for the static output or for server pre-rendered pages.
		 *
		 * They can be use for implementing client-side routing.
		 */
		premises?: {
			/**
			 * @defaultValue false
			 */
			expose?: boolean;

			// * Base path: `/src/routes/`.
			/**
			 * Include routes with a glob filter array.
			 */
			include?: string[];

			/**
			 * Exclude routes with a glob filter array.
			 */
			exclude?: string[];
		};
	};

	/**
	 * Future, unstable features flags.
	 */
	experimental?: {
		/**
		 * Automatically typed route paths.
		 * @experimental
		 */
		generateRoutesTypings?: boolean;

		// /**
		//  * Routes modules for client, used for SPA navigation.
		//  * @experimental
		//  */
		// generateClientRoutes?: boolean;
	};
}
