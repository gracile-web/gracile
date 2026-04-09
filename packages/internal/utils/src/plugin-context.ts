/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResolvedConfig, UserConfig } from 'vite';

const GRACILE_CONTEXT_KEY = Symbol('gracile.shared-context');

/**
 * Describes an element renderer module whose class can be imported
 * at runtime (including production server bundles where Vite plugins
 * aren't available and class references can't be JSON-serialised).
 *
 * - `importSpecifier`: The bare specifier to import (e.g. `'@gracile-labs/css-helpers/shared/dedup-renderer'`).
 * - `exportName`: The named export that is the `ElementRenderer` subclass (e.g. `'DedupLitElementRenderer'`).
 */
export interface RendererModule {
	importSpecifier: string;
	exportName: string;
}

export interface PluginContext {
	litSsrRenderInfo: {
		elementRenderers: any[];
	};

	/**
	 * Module specifiers for element renderers, used to generate imports
	 * in the production server handler bundle.
	 */
	rendererModules: RendererModule[];
}

const sharedContext: PluginContext = {
	litSsrRenderInfo: {
		elementRenderers: [],
	},
	rendererModules: [],
};

type ResolvedConfigWithContext = UserConfig & {
	[GRACILE_CONTEXT_KEY]: PluginContext;
};

/**
 * Retrieve shared context from Vite global context. From the `config()` hook.
 */
export function getPluginContext(
	userConfig: UserConfig | ResolvedConfig,
): PluginContext {
	return (
		(userConfig as ResolvedConfigWithContext)[GRACILE_CONTEXT_KEY] ??
		setContext(userConfig)
	);
}

/**
 * Inject shared context into Vite global context. From the `config()` hook.
 */
function setContext(userConfig: UserConfig | ResolvedConfig): PluginContext {
	(userConfig as ResolvedConfigWithContext)[GRACILE_CONTEXT_KEY] =
		sharedContext;
	return sharedContext;
}
