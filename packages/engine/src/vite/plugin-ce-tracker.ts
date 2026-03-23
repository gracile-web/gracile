/**
 * Vite plugin that tracks Custom Elements registrations on the server
 * and cleans up orphaned CEs when imports are removed during dev HMR.
 *
 * How it works:
 * 1. `configureServer` — installs the registry wrapper (before any modules load).
 * 2. `transform` (SSR only) — injects module-context markers around files that
 *    might call `customElements.define`, so the wrapper knows which module is
 *    responsible for each registration.
 * 3. `hotUpdate` — when a file changes, walks the OLD import tree, finds CE
 *    modules in that tree, blocks their tags, and invalidates them. If they are
 *    still imported after re-evaluation, `define()` fires again and unblocks.
 *    If removed, they stay blocked.
 *
 * @internal
 */

import type { Plugin, EnvironmentModuleNode } from 'vite';

import {
	installCeTracker,
	blockCesForModule,
	hasCeRegistrations,
} from '../dev/ssr-ce-tracker.js';

// ── Helpers ─────────────────────────────────────────────────────────

/** Recursively collect all transitive imports of a module. */
function collectImportTree(
	module_: EnvironmentModuleNode,
	seen = new Set<string>(),
): Set<string> {
	if (!module_.id || seen.has(module_.id)) return seen;
	seen.add(module_.id);
	for (const imported of module_.importedModules) {
		collectImportTree(imported, seen);
	}
	return seen;
}

/** Heuristic: does this source likely define a Custom Element? */
function mightDefineCE(code: string): boolean {
	return (
		code.includes('customElements.define') ||
		// Lit @customElement decorator — calls define() at eval time.
		// Matches both TS source (`@customElement(`) and compiled output.
		/\bcustomElement\s*\(/.test(code)
	);
}

// ── Plugin ──────────────────────────────────────────────────────────

export function gracileCETrackerPlugin(): Plugin {
	return {
		name: 'vite-plugin-gracile-ce-tracker',

		configureServer() {
			installCeTracker();
		},

		// Inject module-context markers so the registry wrapper knows
		// which module is responsible for each define() call.
		transform(code, id, options) {
			if (!options?.ssr) return;
			if (!mightDefineCE(code)) return;

			const escaped = JSON.stringify(id);
			return {
				code: [
					`globalThis.__gracile_ce_tracker?.setModule(${escaped});`,
					code,
					`globalThis.__gracile_ce_tracker?.clearModule();`,
				].join('\n'),
				map: null,
			};
		},

		hotUpdate: {
			order: 'pre',

			handler({ modules, timestamp }) {
				if (this.environment.name !== 'ssr') return;

				const invalidated = new Set<EnvironmentModuleNode>();

				for (const module_ of modules) {
					if (!module_.id) continue;

					// Walk the OLD import tree (graph hasn't updated yet).
					const tree = collectImportTree(module_);

					for (const depId of tree) {
						if (!hasCeRegistrations(depId)) continue;

						// Block this module's CEs. If the module is still imported
						// after re-evaluation, its define() will unblock them.
						blockCesForModule(depId);

						// Force re-evaluation so define() can re-fire.
						const depModule = this.environment.moduleGraph.getModuleById(depId);
						if (depModule) {
							this.environment.moduleGraph.invalidateModule(
								depModule,
								invalidated,
								timestamp,
								true,
							);
						}
					}
				}
			},
		},
	} as const;
}
