import typescript from '@rollup/plugin-typescript';
import type { PluginOption } from 'vite';
// @ts-expect-error - No types available for ts-patch
import tspCompiler from 'ts-patch/compiler';

const VITE_PLUGIN_NAME = 'vite-plugin-jsx-ts';

interface VitePluginOptions {
	tsconfig?: string;
}

export function gracileJsxTs(
	options?: VitePluginOptions | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
	return [
		{
			name: VITE_PLUGIN_NAME,

			config() {
				return { esbuild: { jsx: 'preserve' } };
			},
		} satisfies PluginOption,

		(typescript as any)(
			/* NOTE: Rollup typings mismatch */ {
				typescript: tspCompiler,
				...(options?.tsconfig ? { tsconfig: options.tsconfig } : {}),
			},
		),
	];
}
