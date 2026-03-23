/**
 * Gracile DevTools — Vite plugin.
 *
 * Injects the `<gracile-devtools>` custom element into every page during
 * development.  The element is a self-contained panel (popover-based) that
 * surfaces route information, component trees, and general framework state.
 *
 * ## Usage
 *
 * ```ts
 * // vite.config.ts
 * import { gracile } from '@gracile/gracile/plugin';
 * import { gracileDevtools } from '@gracile-labs/devtools';
 * import { defineConfig } from 'vite';
 *
 * export default defineConfig({
 * 	plugins: [gracile(), gracileDevtools()],
 * });
 * ```
 *
 * @module
 */

import { join } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

import { getVersion } from '@gracile/internal-utils/version';
import type { Plugin, ViteDevServer } from 'vite';

// ── Types ────────────────────────────────────────────────────────────

export interface DevtoolsOptions {
	/**
	 * Position of the floating button.
	 * @default 'bottom-center'
	 */
	position?: 'bottom-center' | 'bottom-left' | 'bottom-right';
}

interface SerializedRoute {
	patternString: string;
	filePath: string;
	hasParams: boolean;
	pageAssets: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Extract routes from Gracile's `PluginSharedState`.
 *
 * The Gracile main plugin stores a `RoutesManifest` (a `Map`) on its
 * closure-captured shared state.  We discover it by iterating the Vite
 * plugin array and looking for the well-known plugin name that holds the
 * reference (via `configureServer`).
 *
 * As a pragmatic alternative we also expose the route filesystem data
 * via a dev-only API endpoint — the CE client fetches that.
 */
function collectRouteData(
	server: ViteDevServer | undefined,
): SerializedRoute[] {
	if (!server) return [];

	// The Gracile engine stores its PluginContext on the Vite resolvedConfig
	// via a Symbol-keyed property.  Try the well-known symbol first.
	const sym = Symbol.for('gracile-plugin-context');
	const context = (server.config as Record<symbol, unknown>)[sym] as
		| Record<string, unknown>
		| undefined;

	if (context && 'routes' in context && context['routes'] instanceof Map) {
		const routes = context['routes'] as Map<
			string,
			{
				filePath: string;
				pattern: { pathname: string } | string;
				hasParams: boolean;
				pageAssets: string[];
			}
		>;
		return [...routes.entries()].map(([key, r]) => ({
			patternString: key,
			filePath: r.filePath,
			hasParams: r.hasParams,
			pageAssets: r.pageAssets,
		}));
	}

	// Fallback: scan the file system for src/routes/**/*.{ts,js,html}
	// (lightweight, doesn't need the engine internals)
	return scanRoutesFromFs(server.config.root);
}

function scanRoutesFromFs(root: string): SerializedRoute[] {
	try {
		const routesDir = join(root, 'src', 'routes');

		try {
			statSync(routesDir);
		} catch {
			return [];
		}

		const results: SerializedRoute[] = [];

		function walk(dir: string, prefix: string): void {
			for (const entry of readdirSync(dir, { withFileTypes: true })) {
				if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;

				const full = join(dir, entry.name);
				const rel = prefix ? `${prefix}/${entry.name}` : entry.name;

				if (entry.isDirectory()) {
					walk(full, rel);
				} else if (
					/\.(ts|js|tsx|jsx|html)$/.test(entry.name) &&
					!entry.name.includes('.client.') &&
					!entry.name.includes('.document.')
				) {
					const patternString =
						'/' +
						rel
							.replace(/\.(ts|js|tsx|jsx|html)$/, '')
							.replace(/\/index$/, '')
							.replace(/^index$/, '');
					const hasParameters = /\[/.test(rel);
					results.push({
						patternString: patternString || '/',
						filePath: `src/routes/${rel}`,
						hasParams: hasParameters,
						pageAssets: [],
					});
				}
			}
		}

		walk(routesDir, '');
		return results;
	} catch {
		return [];
	}
}

// ── Virtual module ───────────────────────────────────────────────────

/**
 * A virtual module that bootstraps the client-side devtools CE.
 * Using a virtual module avoids bare-specifier resolution issues:
 * the `<script src="…">` URL is served by Vite's dev server which
 * resolves the virtual ID through the normal plugin pipeline.
 */
const VIRTUAL_ID = 'virtual:gracile-devtools-client';
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;

// ── Plugin ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function gracileDevtools(options?: DevtoolsOptions): any[] {
	const position = options?.position ?? 'bottom-center';

	// let server: ViteDevServer | undefined;

	return [
		{
			name: 'vite-plugin-gracile-devtools',
			apply: 'serve',

			configureServer(viteServer) {
				// server = viteServer;

				// ── API endpoint ──────────────────────────────────────
				// Serves live route data + version info as JSON.
				viteServer.middlewares.use(
					'/__gracile_devtools__/api',
					(_request, response) => {
						const routes = collectRouteData(viteServer);

						let gracileVersion = '?';
						try {
							gracileVersion = getVersion();
						} catch {
							/* not set yet */
						}

						const viteVersion = viteServer.config.env?.['VITE_VERSION'] ?? '?';

						response.setHeader('Content-Type', 'application/json');
						response.setHeader('Cache-Control', 'no-store');
						response.end(
							JSON.stringify({
								routes,
								gracileVersion,
								viteVersion,
								timestamp: Date.now(),
							}),
						);
					},
				);
			},

			resolveId(id: string) {
				if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
			},

			load(id: string) {
				if (id === RESOLVED_VIRTUAL_ID) {
					// Re-export the real client entry.
					// Vite will resolve this bare specifier during its module
					// transform pipeline (unlike inline <script> content).
					return `import '@gracile-labs/devtools/client';`;
				}
			},

			// Inject the devtools `<script>` + CE tag before `</body>`.
			//
			// We use a `src` attribute pointing at the virtual module so the
			// <script> goes through Vite's normal module pipeline.  This avoids
			// the "Failed to resolve module specifier" error that occurs when a
			// bare specifier is used in inline `<script>` children (those are
			// emitted verbatim into the HTML without Vite transform).
			transformIndexHtml: {
				order: 'post',
				handler() {
					return [
						{
							tag: 'script',
							attrs: {
								type: 'module',
								src: `/@id/__x00__${VIRTUAL_ID}`,
							},
							injectTo: 'body',
						},
						{
							tag: 'gracile-devtools',
							attrs: { position },
							injectTo: 'body',
						},
					];
				},
			},
		} as const,
	] satisfies Plugin[];
}
