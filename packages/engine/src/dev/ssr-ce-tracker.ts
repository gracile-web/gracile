/**
 * Server-side Custom Elements registry tracker for dev HMR.
 *
 * Wraps the Lit SSR DOM shim's `customElements` so orphaned CEs
 * can be blocked when their import is removed during development.
 *
 * @internal — dev-only, never runs in production builds.
 */

/** The subset of {@link CustomElementRegistry} we intercept. */
type CeRegistrySubset = Pick<CustomElementRegistry, 'define' | 'get'>;

// ── Tracking state ──────────────────────────────────────────────────

/** module ID → tag names that module registered */
const moduleToTags = new Map<string, Set<string>>();

/** Tags blocked from registry lookup (orphaned modules) */
const blocked = new Set<string>();

/** Which module is currently being evaluated (set by transform-injected code) */
let currentModuleId: string | null = null;

let installed = false;

// ── Registry wrapper ────────────────────────────────────────────────

function wrapRegistry(registry: CeRegistrySubset) {
	const origDefine = registry.define.bind(registry);
	const origGet = registry.get.bind(registry);

	registry.define = function (
		name: string,
		ctor: CustomElementConstructor,
		options?: ElementDefinitionOptions,
	) {
		// If re-registered after being blocked, unblock.
		blocked.delete(name);

		if (currentModuleId) {
			let tags = moduleToTags.get(currentModuleId);
			if (!tags) {
				tags = new Set();
				moduleToTags.set(currentModuleId, tags);
			}
			tags.add(name);
		}

		try {
			origDefine(name, ctor, options);
		} catch {
			// Already defined — expected during HMR re-evaluation.
		}
	};

	registry.get = function (name: string) {
		if (blocked.has(name)) return;
		return origGet(name);
	};
}

// ── Public API ──────────────────────────────────────────────────────

export function installCeTracker() {
	if (installed) return;
	installed = true;

	if (globalThis.customElements) {
		wrapRegistry(globalThis.customElements);
	} else {
		// Shim not yet installed — intercept the assignment so we can
		// wrap it the moment Lit SSR's DOM shim sets it up.
		let _ce: CeRegistrySubset | undefined;
		Object.defineProperty(globalThis, 'customElements', {
			get: () => _ce,
			set(value: CeRegistrySubset) {
				_ce = value;
				wrapRegistry(value);
			},
			configurable: true,
			enumerable: true,
		});
	}

	// Expose for transform-injected code.
	// Runs in the same process via Vite's ssrLoadModule.
	(globalThis as Record<string, unknown>)['__gracile_ce_tracker'] = {
		setModule(id: string) {
			currentModuleId = id;
		},
		clearModule() {
			currentModuleId = null;
		},
	};
}

/**
 * Block all CEs registered by a given module.
 * They will be unblocked if the module is re-evaluated and calls define() again.
 */
export function blockCesForModule(moduleId: string) {
	const tags = moduleToTags.get(moduleId);
	if (!tags) return;
	for (const tag of tags) {
		blocked.add(tag);
	}
}

/** Check whether a module has registered any CEs. */
export function hasCeRegistrations(moduleId: string): boolean {
	return moduleToTags.has(moduleId);
}

/**
 * Reset tracking state.
 * @param full - Also reset installation state (for test suite teardown
 *   so a subsequent `installCeTracker` call takes effect).
 */
export function resetCeTracker(full = false) {
	moduleToTags.clear();
	blocked.clear();
	currentModuleId = null;
	if (full) installed = false;
}

/** Read-only view of currently blocked tags. For test assertions. */
export function getBlockedTags(): ReadonlySet<string> {
	return blocked;
}

/** Read-only view of module → tag-names mappings. For test assertions. */
export function getModuleToTags(): ReadonlyMap<string, ReadonlySet<string>> {
	return moduleToTags;
}
