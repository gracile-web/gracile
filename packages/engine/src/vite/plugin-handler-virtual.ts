/**
 * Vite plugin: `gracile:handler` virtual module.
 *
 * Provides the Gracile request handler via a virtual import so that
 * the user's server entry can `import { handler } from 'gracile:handler'`.
 *
 * - **Dev**: resolves to a thin wrapper that delegates to the live
 *   development handler stored in shared state.
 * - **Build (SSR env)**: resolves to the route manifest + handler creation
 *   code (the same content that `gracileEntrypointPlugin` emits for
 *   `entrypoint.js`).
 *
 * When `server.entry` is **not** configured this plugin is inert — the
 * virtual module is never imported by anything.
 *
 * @internal
 */

import type { Plugin, ResolvedConfig } from 'vite';
import { getPluginContext } from '@gracile/internal-utils/plugin-context';

import type { GracileHandler } from '../server/request.js';

import type { PluginSharedState } from './plugin-shared-state.js';
import {
	GRACILE_ENVIRONMENT_NAMES,
	GRACILE_HANDLER_MODULE_ID,
	RESOLVED_GRACILE_HANDLER_MODULE_ID,
} from './constants.js';
import { createServerEntrypointGracileHandler } from './server-handler.js';

// ── Dev-time handler bridge ──────────────────────────────────────────

/**
 * Unique key on `globalThis` used to share the dev handler reference
 * between the Vite plugin host (which calls `setDevelopmentHandler`)
 * and the SSR module runner (which calls `getDevelopmentHandler`).
 *
 * A Symbol would be ideal but the runner evaluates a fresh copy of this
 * module, so we use a string key instead.
 */
const HANDLER_KEY = '__gracile_dev_handler__';

/** Called by `plugin-serve.ts` once the development handler is ready. */
export function setDevelopmentHandler(handler: GracileHandler): void {
	(globalThis as Record<string, unknown>)[HANDLER_KEY] = handler;
}

/** Used by the dev-time virtual module code (imported by the SSR runner). */
export function getDevelopmentHandler(): GracileHandler {
	const handler = (globalThis as Record<string, unknown>)[HANDLER_KEY] as
		| GracileHandler
		| undefined;

	if (!handler)
		throw new Error(
			'[gracile] Dev handler not initialised yet. ' +
				'Make sure the Vite dev server has started before importing gracile:handler.',
		);

	return handler;
}

// ── Plugin ───────────────────────────────────────────────────────────

export function gracileHandlerVirtualPlugin({
	state,
}: {
	state: PluginSharedState;
}): Plugin[] {
	let resolvedConfig: ResolvedConfig | undefined;

	return [
		// -- Serve (dev) --------------------------------------------------
		{
			name: 'gracile-handler-virtual:serve',
			apply: 'serve',

			resolveId(id) {
				if (id === GRACILE_HANDLER_MODULE_ID)
					return RESOLVED_GRACILE_HANDLER_MODULE_ID;
				return null;
			},

			load(id) {
				if (id !== RESOLVED_GRACILE_HANDLER_MODULE_ID) return null;

				// The generated code imports the bridge function from this very
				// file.  Because the SSR runner executes in the same Node
				// process, the `getDevelopmentHandler` closure shares state with
				// `setDevelopmentHandler` called by plugin-serve.
				return `
import { getDevelopmentHandler } from '@gracile/gracile/_internals/handler-bridge';

export const handler = (...args) => getDevelopmentHandler()(...args);
`;
			},
		} as const,

		// -- Build (SSR environment only) ----------------------------------
		{
			name: 'gracile-handler-virtual:build',
			apply: 'build',

			applyToEnvironment(environment) {
				return environment.name === GRACILE_ENVIRONMENT_NAMES.ssr;
			},

			configResolved(config) {
				resolvedConfig = config;
			},

			resolveId(id) {
				if (id === GRACILE_HANDLER_MODULE_ID)
					return RESOLVED_GRACILE_HANDLER_MODULE_ID;
				return null;
			},

			load(id) {
				if (id !== RESOLVED_GRACILE_HANDLER_MODULE_ID) return null;
				if (!state.routes || !state.renderedRoutes) return null;

				const context = resolvedConfig
					? getPluginContext(resolvedConfig)
					: undefined;

				// Same handler-creation code currently emitted by
				// gracileEntrypointPlugin for the virtual `entrypoint.js`.
				return createServerEntrypointGracileHandler(
					state.gracileConfig,
					context?.rendererModules ?? [],
				);
			},
		} as const,
	];
}
