import * as t from '@babel/types';

export const HTML_VOID_ELEMENTS = new Set([
	'area',
	'base',
	'br',
	'col',
	'command',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
]);

export const COMPONENTS = {
	For: 'For',
	Fragment: 'Fragment',
} as const;

export const NAMESPACES = {
	property: 'prop',
	attribute: 'attr',
	event: 'on',
	boolean: 'bool',
	class: 'class',
	style: 'style',
	unsafe: 'unsafe',
	ifDefined: 'if',
	for: 'for',
	useDirective: 'use',
} as const;

export const SUB_NAMESPACES = {
	map: 'map',
	list: 'list',
	html: 'html',
	svg: 'svg',
	key: 'key',
	reference: 'ref',
} as const;

// Types
export type LitHtmlFlavor = 'default' | 'signal' | 'server';
export type ImportName =
	| 'html'
	| 'ref'
	| 'classMap'
	| 'styleMap'
	| 'classList'
	| 'unsafeHTML'
	| 'unsafeSVG'
	| 'repeat'
	| 'ifDefined';

export interface ImportConfig {
	local: ImportName;
	imported: string;
	value: string | { [K in LitHtmlFlavor]: string };
}

// export interface PluginOptions {
// 	autoImports?: boolean;
// 	additionalImports?: ImportConfig[];
// }

export const DEFAULT_IMPORTS = [
	{
		local: 'html',
		imported: 'html',
		value: {
			default: 'lit',
			signal: '@lit-labs/signals',
			server: '@lit-labs/ssr',
		},
	},
	{ local: 'ref', imported: 'ref', value: 'lit/directives/ref.js' },
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
	{ local: 'classList', imported: 'clsx', value: 'clsx' },
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
		local: 'ifDefined',
		imported: 'ifDefined',
		value: 'lit/directives/if-defined.js',
	},
	{
		local: 'repeat',
		imported: 'repeat',
		value: 'lit/directives/repeat.js',
	},
] as const satisfies ImportConfig[];

// export const DEFAULT_PLUGIN_OPTIONS = {
// 	autoImports: true,
// 	additionalImports: DEFAULT_IMPORTS,
// } as const satisfies PluginOptions;

export const DEFAULT_PLUGIN_OPTIONS = {
	autoImports: true,
	additionalImports: DEFAULT_IMPORTS,
};
export type PluginOptions = Partial<typeof DEFAULT_PLUGIN_OPTIONS>;

// export const TOKENS = {
// 	openingTag: '<',
// 	closingTag: '>',
// 	openingEndTag: '</',
// 	event: '@',
// 	prop: ':',
// 	boolean: '?',
// 	equal: '=',
// } as const;

export class JsxToLiteralError extends Error {
	public override readonly name = 'JsxToLiteralError';
	constructor(
		public message = 'An unknown error occurred during JSX transformation',
		public node?: t.Node,
	) {
		super(message, { cause: node });
	}

	public static is(error: unknown): error is JsxToLiteralError {
		return Boolean(
			typeof error === 'object' &&
			error &&
			'name' in error &&
			error.name === 'JsxToLiteralError',
		);
	}
}
