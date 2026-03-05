/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResolvedConfig, UserConfig } from 'vite';

const GRACILE_CONTEXT_KEY = Symbol('gracile.shared-context');

export interface PluginContext {
	litSsrRenderInfo: {
		elementRenderers: any[];
	};
}

const sharedContext: PluginContext = {
	litSsrRenderInfo: {
		elementRenderers: [],
	},
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
