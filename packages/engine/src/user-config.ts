import type { RenderInfo } from '@lit-labs/ssr';
import type { Connect } from 'vite';

import type { MaybePromise } from './routes/route.js';

/**
 * A route defined programmatically in config, complementing file-based routes.
 *
 * @example
 * ```ts
 * gracile({
 *   routes: {
 *     define: async () => [
 *       { pattern: '/api/posts', filePath: 'src/custom/api-posts.ts' },
 *       { pattern: '/blog/:slug', filePath: 'src/custom/blog-post.ts' },
 *     ],
 *   },
 * });
 * ```
 */
export interface ProgrammaticRoute {
	/**
	 * URL pattern for this route, using URLPattern syntax.
	 *
	 * @example `'/api/posts'`
	 * @example `'/blog/:slug'`
	 * @example `'/docs/:path*'`
	 */
	pattern: string;

	/**
	 * Path to the route module file, relative to the project root.
	 * The file must use `defineRoute()` just like any file-based route.
	 *
	 * @example `'src/custom/api-posts.ts'`
	 */
	filePath: string;

	/**
	 * Explicit client-side assets (scripts, stylesheets) associated with this route.
	 * If omitted, Gracile will attempt to auto-detect co-located assets by file stem.
	 *
	 * @example `['src/custom/api-posts.client.ts', 'src/custom/api-posts.css']`
	 */
	pageAssets?: string[];
}

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
	 * Settings for server mode.
	 *
	 * Only meaningful when `output` is `'server'`.
	 */
	server?: {
		/**
		 * Path to the user's server entry file (e.g. `'./server.ts'`).
		 *
		 * When set, Gracile will:
		 * - **Dev**: load the file via the Vite SSR environment and bridge it
		 *   into the dev server as middleware (Vite keeps the HTTP listener).
		 * - **Build**: use it as the SSR build input so the entire server is
		 *   bundled into `dist/server/`.
		 *
		 * The entry file should `import { handler } from 'gracile:handler'`
		 * and export a default app (Hono/Express) instance.
		 *
		 * @example
		 * ```ts
		 * gracile({
		 *   output: 'server',
		 *   server: { entry: './server.ts' },
		 * })
		 * ```
		 */
		entry?: string;
	};

	/**
	 * Settings for the development mode.
	 */
	dev?: {
		/**
		 * Get incoming request context and apply locals for the Gracile request handler.
		 * Useful for mocking the production server.
		 *
		 * For `server` mode only.
		 *
		 * Not needed when using `server.entry` — the user's own middleware
		 * provides locals directly.
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

		/**
		 * Define programmatic routes alongside file-based routes.
		 *
		 * The returned route definitions are merged with the file-based routes
		 * found in `src/routes/`. If a programmatic route's pattern conflicts
		 * with a file-based route, the programmatic route takes priority.
		 *
		 * The async function signature allows fetching route definitions from
		 * a CMS, reading an OpenAPI spec, or any other async source.
		 *
		 * @example
		 * ```ts
		 * gracile({
		 *   routes: {
		 *     define: async () => [
		 *       { pattern: '/api/posts', filePath: 'src/api/posts.ts' },
		 *       { pattern: '/blog/:slug', filePath: 'src/blog/post.ts' },
		 *       { pattern: '/docs/:path*', filePath: 'src/docs/catchall.ts' },
		 *     ],
		 *   },
		 * });
		 * ```
		 */
		define?: () => MaybePromise<ProgrammaticRoute[]>;
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
