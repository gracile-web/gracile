import { babel } from '@rollup/plugin-babel';
import type { PluginOption } from 'vite';
import babelPluginJsxToLiterals, {
	type PluginOptions as JsxPluginOptions,
} from '@gracile-labs/babel-plugin-jsx-to-literals';
// import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx';
// @ts-expect-error No typings…
import babelPluginSyntaxTypescript from '@babel/plugin-syntax-typescript';

const VITE_PLUGIN_NAME = 'vite-plugin-jsx-to-literals';

const additionalImports = [
	{
		local: 'html',
		imported: 'html',
		value: {
			default: 'lit',
			signal: '@lit-labs/signals',
			// TODO: Refactor imports.
			server: '@gracile/gracile/server-html',
		},
	},
	{
		local: 'ref',
		imported: 'ref',
		value: 'lit/directives/ref.js',
	},
	{
		local: 'classMap',
		imported: 'classMap',
		value: 'lit/directives/class-map.js',
	},
	{
		local: 'styleMap',
		imported: 'styleMap',
		value: 'lit/directives/style-map.js',
	},
	{
		local: 'classList',
		imported: 'clsx',
		// TODO: Refactor imports.
		value:
			'@gracile-labs/vite-plugin-babel-jsx-to-literals/_internal/class-list',
	},
	{
		local: 'unsafeHTML',
		imported: 'unsafeHTML',
		value: 'lit/directives/unsafe-html.js',
	},
	{
		local: 'unsafeSVG',
		imported: 'unsafeSVG',
		value: 'lit/directives/unsafe-svg.js',
	},
	{
		local: 'computed',
		imported: 'computed',
		value: '@lit-labs/signals',
	},
	{
		local: 'ifDefined',
		imported: 'ifDefined',
		value: 'lit/directives/if-defined.js',
	},
	{
		local: 'repeat',
		imported: 'repeat',
		value: 'lit/directives/repeat.js',
	},
]; /* satisfies JsxPluginOptions['additionalImports'] */

interface VitePluginOptions {
	babelPlugin?: JsxPluginOptions;
}

export const cemPluginDefaultOptions = {
	outdir: 'src/types',
	fileName: 'jsx.d.ts',

	globalTypePath: './elements.d.ts',
	// NOTE: Not providing full path.
	// componentTypePath(...args) {
	// 	console.log({ args });
	// 	return `./${'tag'}.element.ts`;
	// },
};

export function gracileJsx(
	options?: VitePluginOptions | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
	return [
		{
			name: VITE_PLUGIN_NAME,

			config() {
				// TODO: Vite 7/8 bifurcation (esbuild/oxc)
				return { esbuild: { jsx: 'preserve' }, oxc: { jsx: 'preserve' } };
			},
		} as const satisfies PluginOption,

		babel({
			extensions: ['.tsx', '.jsx'],
			sourceType: 'unambiguous',
			babelHelpers: 'bundled', // NOTE: Explicit default.

			plugins: [
				[babelPluginSyntaxTypescript, { isTSX: true }],

				[
					babelPluginJsxToLiterals,
					options?.babelPlugin || {
						autoImports: true,

						additionalImports,
					},
				],
			],
		}),
	];
}

export type { PluginOptions } from '@gracile-labs/babel-plugin-jsx-to-literals';
