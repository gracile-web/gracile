import typescript, {
	type RollupTypescriptOptions,
	type RollupTypescriptPluginOptions,
} from '@rollup/plugin-typescript';
import type { PluginOption } from 'vite';
// @ts-expect-error - No types available for ts-patch
import tspCompiler from 'ts-patch/compiler/typescript.js';

const VITE_PLUGIN_NAME = 'vite-plugin-jsx-ts';

interface VitePluginOptions {
	rollupTypescript?: RollupTypescriptOptions;
}

// TODO: Documentation for the proper tsconfig.
// For example: "outDir": "dist" (aligned with rollup output dir).
// Or maybe this can be fully encapsulated here?

export function gracileJsxTs(
	options?: VitePluginOptions | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
	return [
		{
			name: VITE_PLUGIN_NAME,

			config() {
				// TODO: Investigate if it's always needed.
				return { esbuild: { jsx: 'preserve' } };
			},
		} satisfies PluginOption,

		(typescript as any)(
			/* NOTE: Rollup typings mismatch */ {
				typescript: tspCompiler,
				...(options?.rollupTypescript ? options.rollupTypescript : {}),
			} satisfies RollupTypescriptPluginOptions,
		),
	];
}
