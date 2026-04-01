/**
 * Shared mutable state passed between the Gracile Vite plugin phases.
 *
 * This exists because Vite plugins in the same array share data through
 * closures. Making the shared state explicit (instead of ad-hoc `let`
 * variables) makes the data flow between plugins visible and auditable.
 *
 * @internal
 */

import { getPluginContext } from '@gracile/internal-utils/plugin-context';
import type { ResolvedConfig, UserConfig } from 'vite';

import type { RenderedRouteDefinition } from '../routes/render.js';
import type { RoutesManifest } from '../routes/route.js';
import type { GracileConfig } from '../user-config.js';

export interface PluginSharedState {
	/** Collected file-system routes (populated during dev and build). */
	routes: RoutesManifest;

	/** Rendered route definitions from the client build phase. */
	renderedRoutes: RenderedRouteDefinition[] | null;

	/** Rollup input list for the client build (populated by route renderer). */
	clientBuildInputList: string[] | null;

	/** Maps original asset names → hashed filenames from the client bundle. */
	clientAssets: Record<string, string>;

	/** Vite `root` captured during build config. */
	root: string | null;

	/** The resolved Gracile configuration. */
	gracileConfig: GracileConfig;

	/** The output mode: 'static' or 'server'. */
	outputMode: 'static' | 'server';
}

/**
 * Merge previously-registered element renderers from the Gracile config into
 * the given Vite config's plugin context, then write the unified
 * `litSsrRenderInfo` back so all consumers share the same reference.
 */
export function syncLitSsrRenderers(
	gracileConfig: GracileConfig,
	viteConfig: UserConfig | ResolvedConfig,
): void {
	const context = getPluginContext(viteConfig);
	const existing = gracileConfig.litSsr?.renderInfo?.elementRenderers ?? [];
	if (existing.length > 0)
		context.litSsrRenderInfo.elementRenderers.push(...existing);
	gracileConfig.litSsr ??= {};
	gracileConfig.litSsr.renderInfo = context.litSsrRenderInfo;
}

/**
 * Create a fresh shared state object.
 */
export function createPluginSharedState(
	config: GracileConfig | undefined,
): PluginSharedState {
	return {
		routes: new Map(),
		renderedRoutes: null,
		clientBuildInputList: null,
		clientAssets: {},
		root: null,
		gracileConfig: config || ({} as GracileConfig),
		outputMode: config?.output || 'static',
	};
}
