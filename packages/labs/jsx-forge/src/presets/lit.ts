import type { Preset } from '../to-literals/types.js';

export const PRESETS = {
	Default: {
		antiCollisionImportPrefix: '$_',
		attributes: [
			{
				do: {
					addImports: [
						{
							as: 'styleMap',
							name: 'styleMap',
							path: 'lit/directives/style-map.js',
						},
					],
					insertExpression: { valueFunctionWrapper: { name: 'styleMap' } },
					removeNamespace: true,
					renameTo: 'style',
				},
				when: { name: 'map', namespace: 'style' },
			},
			{
				do: {
					addImports: [{ as: 'clsx', name: 'clsx', path: 'clsx' }],
					insertExpression: { valueFunctionWrapper: { name: 'clsx' } },
					removeNamespace: true,
					renameTo: 'class',
				},
				when: { name: 'list', namespace: 'class' },
			},
			{
				do: {
					addImports: [
						{
							as: 'classMap',
							name: 'classMap',
							path: 'lit/directives/class-map.js',
						},
					],

					insertExpression: { valueFunctionWrapper: { name: 'classMap' } },
					removeNamespace: true,
					renameTo: 'class',
				},
				when: { name: 'map', namespace: 'class' },
			},
			{
				do: { addPrefix: '.', removeNamespace: true },
				when: { namespace: '_' },
			},
			{
				do: { addPrefix: '@', removeNamespace: true },
				when: { namespace: 'on' },
			},
			{
				do: {
					addPrefix: '?',
					insertExpression: { valueFunctionWrapper: { name: 'Boolean' } },
					removeNamespace: true,
				},
				when: { namespace: 'bool' },
			},
			{
				do: {
					insertExpression: {
						valueFunctionWrapper: { name: 'JSON.stringify' },
					},
					removeNamespace: true,
				},
				when: { namespace: 'attr' },
			},
			{
				do: {
					addImports: [
						{
							as: 'ifDefined',
							name: 'ifDefined',
							path: 'lit/directives/if-defined.js',
						},
					],

					insertExpression: { valueFunctionWrapper: { name: 'ifDefined' } },
					removeNamespace: true,
				},
				when: { namespace: 'if' },
			},
			{
				do: {
					addImports: [
						{ as: 'ref', name: 'ref', path: 'lit/directives/ref.js' },
					],
					insertExpression: {
						inPlace: true,
						valueFunctionWrapper: { name: 'ref' },
					},
				},
				when: {
					name: 'ref',
					namespace: 'use',
				},
			},
			// IDEA: Directives
			// {
			// 	when: {
			// 		namespace: 'use',
			// 	},
			// 	do: {
			// 		insertExpression: {
			// 			inPlace: true,
			// 			valueFunctionWrapper: { useProvidedName: true },
			// 		},
			// 		addImports: [
			// 			// ???
			// 		],
			// 	},
			// },
			{
				do: {
					addImports: [
						{
							as: 'unsafeHTML',
							name: 'unsafeHTML',
							path: 'lit/directives/unsafe-html.js',
						},
					],
					insertExpression: {
						inBody: true,
						valueFunctionWrapper: { name: 'unsafeHTML' },
					},
				},
				when: { name: 'html', namespace: '$' },
			},
			{
				do: {
					addImports: [
						{
							as: 'unsafeSVG',
							name: 'unsafeSVG',
							path: 'lit/directives/unsafe-svg.js',
						},
					],
					insertExpression: {
						inBody: true,
						valueFunctionWrapper: { name: 'unsafeSVG' },
					},
				},
				when: { name: 'svg', namespace: '$' },
			},
			{
				do: {
					addImports: [
						{
							as: 'ifDefined',
							name: 'ifDefined',
							path: 'lit/directives/if-defined.js',
						},
					],
					insertExpression: { valueFunctionWrapper: { name: 'ifDefined' } },
				},
				when: { namespace: null, type: { isAssignableTo: 'undefined' } },
			},
			{
				do: { addPrefix: '?' },
				when: { namespace: null, type: { isAssignableTo: 'boolean' } },
			},
		],

		children: {
			// keyArg: 'inner:children',
			keyName: '$:children',
		},

		forEach: {
			addImports: [
				{ as: 'repeat', name: 'repeat', path: 'lit/directives/repeat.js' },
			],
			keyNameAttributeName: 'key',
			keyNameAttributeNameOnAnyElement: 'each:key',
			tagName: 'for:each',
		},

		useLiteral: {
			default: [{ as: 'html', name: 'html', path: 'lit' }],
			server: [{ as: 'html', name: 'html', path: '@lit-labs/ssr' }],
			signal: [{ as: 'html', name: 'html', path: '@lit-labs/signals' }],
			svg: [{ as: 'svg', name: 'svg', path: 'lit' }],
		},

		virtualElements: [
			{
				addImports: [
					{
						as: 'unsafeHTML',
						name: 'unsafeHTML',
						path: 'lit/directives/unsafe-html.js',
					},
				],
				arguments: ['content'],
				tagName: '$:html',
				valueFunctionWrapper: { name: 'unsafeHTML' },
			},
			{
				addImports: [
					{
						as: 'unsafeSVG',
						name: 'unsafeSVG',
						path: 'lit/directives/unsafe-svg.js',
					},
				],
				arguments: ['content'],
				tagName: '$:svg',
				valueFunctionWrapper: { name: 'unsafeSVG' },
			},
		],
	},
} as const satisfies Record<string, Preset>;
