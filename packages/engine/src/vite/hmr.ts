import type { PluginOption, EnvironmentModuleNode, Plugin } from 'vite';

import { GRACILE_ENVIRONMENT_NAMES } from './constants.js';

// ── Conventions ─────────────────────────────────────────────────────
//
// Route entry:        src/routes/**/*.{ts,tsx,js,jsx}  (not .client.)
// Sibling asset:      ROUTE.client.{ts,tsx,...} | ROUTE.{css,scss,...}
// Ignored route file: _prefixed in routes dir — importable, not a route
// Client-only module: *.client.{ts,tsx,js,jsx} (anywhere in the tree)
//
// HMR rules:
//   1. .client. files  → NEVER full-reload; invalidate SSR cache only,
//      let client Vite HMR handle the update (soft reload).
//   2. Route modules   → ALWAYS full SSR reload.
//   3. Transitive SSR deps of routes → full SSR reload.
//   4. Client-only modules (not reachable from any route) → skip.

/** Matches any `.client.{js,ts,jsx,tsx}` module (client-only by convention). */
const CLIENT_MODULE_RE = /\.client\.[jt]sx?$/;

/**
 * Matches route entry files in `src/routes/`, excluding `.client.` siblings.
 * These may live in both the SSR and client module graphs when the client
 * router is active (isomorphic routes).
 */
const ROUTE_MODULE_RE = /\/src\/routes\/.*(?<!\.client)\.[jt]sx?$/;

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Walk the SSR module graph **upward** through `importers` to determine
 * whether `mod` is a transitive dependency of at least one route module.
 *
 * This is the key fix for files outside `src/routes/` that are imported
 * by a route (e.g. `src/features/_foo.ts`): when these exist in **both**
 * the SSR and client graphs (because the client router pulls in route
 * deps), the old handler skipped them — this walk ensures they trigger
 * a full SSR reload when they actually affect server output.
 */
function isRouteDependent(
	module_: EnvironmentModuleNode,
	seen = new Set<string>(),
): boolean {
	if (!module_.id || seen.has(module_.id)) return false;
	seen.add(module_.id);

	if (ROUTE_MODULE_RE.test(module_.id)) return true;

	for (const importer of module_.importers) {
		if (isRouteDependent(importer, seen)) return true;
	}
	return false;
}

// NOTE: From https://vite.dev/guide/migration#advanced (Vite 5>6 migration).
export function hmrSsrReload(): PluginOption {
	return {
		name: 'vite-plugin-gracile-hmr-ssr-reload',
		enforce: 'post',

		hotUpdate: {
			order: 'post',

			handler({ modules, server, timestamp }) {
				if (this.environment.name !== GRACILE_ENVIRONMENT_NAMES.ssr) return;

				let needsFullReload = false;
				const invalidatedModules = new Set<EnvironmentModuleNode>();

				for (const module_ of modules) {
					if (module_.id == null) continue;

					// ── 1. Client-only modules (.client.ts) ─────────────
					// By convention, .client. files never affect SSR output.
					// Invalidate the SSR cache (so the next SSR render sees
					// updated code if it happens to be transitively imported)
					// but do NOT trigger a full page reload — the client
					// environment handles the update via standard Vite HMR.
					if (CLIENT_MODULE_RE.test(module_.id)) {
						this.environment.moduleGraph.invalidateModule(
							module_,
							invalidatedModules,
							timestamp,
							true,
						);
						continue;
					}

					// ── 2. Shared modules (in both SSR + client graphs) ──
					// When the client router is active, route dependencies
					// live in both module graphs. The old handler skipped
					// any module present in the client graph (assuming Vite
					// client HMR was enough), but that's wrong for deps
					// that also affect SSR output.
					//
					// Fix: walk the SSR importer chain upward. If the
					// module is reachable from a route → it affects SSR →
					// full reload. Otherwise let client HMR handle it.
					const clientModule =
						server.environments.client.moduleGraph.getModuleById(module_.id);

					if (
						clientModule != null &&
						!ROUTE_MODULE_RE.test(module_.id) &&
						!isRouteDependent(module_)
					) {
						// Purely client-side module → skip.
						continue;
					}

					// ── 3. SSR dependency → invalidate + full reload ─────
					this.environment.moduleGraph.invalidateModule(
						module_,
						invalidatedModules,
						timestamp,
						true,
					);
					needsFullReload = true;
				}

				if (needsFullReload) {
					server.ws.send({ type: 'full-reload' });
					return [];
				}

				// .client. modules were invalidated without full reload.
				// Return [] so the SSR env skips its default handling;
				// the client environment's HMR pipeline handles the
				// browser-side update independently.
				if (invalidatedModules.size > 0) {
					return [];
				}
			},
		},
	} as const;
}

// ── Client-module self-acceptance ───────────────────────────────────
//
// `.client.{ts,tsx,js,jsx}` files are side-effectful entry scripts
// injected into the HTML via `<script type="module">`. Without an HMR
// boundary, Vite's client propagation bubbles to the root and triggers
// a full page reload — even though the SSR side correctly skips them.
//
// This plugin injects `import.meta.hot.accept()` so that Vite
// re-executes the module in-place (side effects re-run) instead of
// reloading the whole page. Same pattern as React Refresh / Vue HMR.

export function hmrClientSelfAccept(): Plugin {
	return {
		name: 'vite-plugin-gracile-hmr-client-self-accept',
		apply: 'serve',

		transform(code, id) {
			if (!CLIENT_MODULE_RE.test(id)) return;

			return {
				code: code + `\nif (import.meta.hot) { import.meta.hot.accept(); }\n`,
				map: null,
			};
		},
	} as const;
}
