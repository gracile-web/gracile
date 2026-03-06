import type { RenderInfo } from '@lit-labs/ssr';
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
	 * Controls how trailing slashes are matched on incoming URLs.
	 *
	 * - `'ignore'` — Match regardless of whether a trailing `/` is present.
	 *   `/about` and `/about/` both resolve to the same route. *(default)*
	 * - `'always'` — Only match URLs that include a trailing slash (e.g. `/about/`).
	 *   Requests without one are redirected: `301` for GET, `308` for other methods.
	 * - `'never'` — Only match URLs that do not include a trailing slash (e.g. `/about`).
	 *   Requests with one are redirected: `301` for GET, `308` for other methods.
	 *
	 * @defaultValue 'ignore'
	 */
	trailingSlash?: 'always' | 'never' | 'ignore';

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
	litSsr?: {
		/**
		 * Lets you extend Gracile's SSR pipeline with
		 * custom Lit SSR `ElementRenderer` subclasses. This is the foundation for
		 * features like [Islands](/docs/add-ons/islands/), which register a renderer
		 * for the `<is-land>` custom element to server-render components from other
		 * UI frameworks.
		 *
		 * In most cases, you do **not** set this option manually — add-on plugins
		 * (like `gracileIslands()`) register their renderers automatically via the
		 * plugin context communication channel. However,
		 * you can use it directly for advanced use cases:
		 *
		 * ```ts
		 * import { gracile } from '@gracile/gracile/plugin';
		 * import { defineConfig } from 'vite';
		 *
		 * export default defineConfig({
		 *   plugins: [
		 *     gracile({
		 *       litSsr: {
		 *         renderInfo: {
		 *           elementRenderers: [
		 *             // Your custom ElementRenderer subclass
		 *           ],
		 *         },
		 *       },
		 *     }),
		 *   ],
		 * });
		 * ```
		 */
		renderInfo?: Partial<RenderInfo>;
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
