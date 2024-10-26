import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
// import pluginReact from 'eslint-plugin-react';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import jsdoc from 'eslint-plugin-jsdoc';
import importX from 'eslint-plugin-import-x';
// import importX from 'eslint-plugin-import-x';
// import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
	{
		ignores: ['coverage', 'dist'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	},

	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },

	{
		languageOptions: {
			parserOptions: {
				project: [
					'./packages/gracile/tsconfig.json',
					'./packages/client/tsconfig.json',
					'./packages/server/tsconfig.json',
					'./packages/engine/tsconfig.json',
					// './packages/cli/tsconfig.json',
					'./packages/create-gracile/tsconfig.json',
					'./packages/internal/utils/tsconfig.json',
					'./packages/addons/metadata/tsconfig.json',
					'./packages/addons/svg/tsconfig.json',
					'./packages/addons/sitemap/tsconfig.json',
					'./packages/addons/markdown/tsconfig.json',
					'./packages/addons/markdown-preset-marked/tsconfig.json',
				],
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},

	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	// pluginReact.configs.flat.recommended,

	eslintPluginUnicorn.configs['flat/all'],

	// jsdoc.configs['flat/recommended-typescript'],

	// importX.configs['recommended'],
	// importX.configs['typescript'],

	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	// importX.flatConfigs.react,

	{
		rules: {
			'import-x/order': [
				'error',
				{
					'newlines-between': 'always',
					pathGroups: [
						{
							pattern: '@app/**',
							group: 'external',
							position: 'after',
						},
					],
					distinctGroup: false,
				},
			],
		},
	},

	{
		rules: {
			'no-console': 'warn',
			'unicorn/no-null': 'off',
			'unicorn/template-indent': 'off',

			'class-methods-use-this': 'warn',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-extraneous-class': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-use-before-define': 'error',
			'@typescript-eslint/require-await': 'error',

			'jsdoc/require-jsdoc': [
				// 'warn',
				'off',
				// {
				// 	require: {
				// 		FunctionDeclaration: true,
				// 		MethodDefinition: true,
				// 		ClassDeclaration: true,
				// 	},
				// },
			],

			'unicorn/import-style': [
				'off',
				// {
				// 	styles: {
				// 		util: false,
				// 		path: {
				// 			named: true,
				// 		},
				// 	},
				// },
			],
		},
	},

	{
		ignores: [
			'**/packages/labs',
			'**/packages/cli',
			'pnpm-lock.yaml',
			'**/integration',
			// '**/integration/**/*_expected*',
			// '**/integration/__fixtures__',
			'CHANGELOG.md',
			'dist',
			'labs',
			'./index.ts',
			'**/eslint.config*',

			'**/.dev*',
			'**/.old*',

			'**/coverage',
			'**/dist',
		],
	},
];
