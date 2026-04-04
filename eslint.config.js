import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
// import jsdoc from 'eslint-plugin-jsdoc';
import importX from 'eslint-plugin-import-x';

/** @type {import('eslint').Linter.Config[]} */
const config = [
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

					'./packages/create-gracile/tsconfig.json',
					'./packages/internal/utils/tsconfig.json',
					'./packages/addons/metadata/tsconfig.json',
					'./packages/addons/svg/tsconfig.json',
					'./packages/addons/sitemap/tsconfig.json',
					'./packages/addons/markdown/tsconfig.json',
					'./packages/addons/markdown-preset-marked/tsconfig.json',

					'./packages/labs/better-errors/tsconfig.json',
					'./packages/labs/css-helpers/tsconfig.json',
					'./packages/labs/client-router/tsconfig.json',
					'./packages/labs/islands/tsconfig.json',
					'./packages/labs/vite-plugin-babel-jsx-to-literals/tsconfig.json',
					'./packages/labs/hmr/tsconfig.json',
					'./packages/labs/babel-plugin-jsx-to-literals/tsconfig.json',
					'./packages/labs/jsx-forge/tsconfig.json',
					'./packages/labs/vite-plugin-jsx-forge/tsconfig.json',
					'./packages/labs/functional/tsconfig.json',
					'./packages/labs/devtools/tsconfig.json',
					'./packages/labs/og-images-generator/tsconfig.json',
					'./packages/labs/literals/parser/tsconfig.json',
					'./packages/labs/literals/html-css-minifier/tsconfig.json',
					'./packages/labs/literals/rollup-plugin-html-css-minifier/tsconfig.json',
					'./packages/labs/vite-plugin-standard-css-modules/tsconfig.json',
					'./docs/website/tsconfig.json',
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
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/require-await': 'error',

			// '@typescript-eslint/explicit-member-accessibility': 'error',

			'unicorn/no-array-sort': 'off',
			'unicorn/require-module-specifiers': 'off',

			'unicorn/prevent-abbreviations': [
				'error',
				{
					ignore: ['e2e'],
				},
			],
			// 'unicorn/consistent-function-scoping': 'off',
			// 'unicorn/no-await-expression-member': 'off',
			// 'unicorn/filename-case': 'off',
			// 'unicorn/prefer-import-meta-properties': 'off',
			// 'unicorn/no-empty-file': 'off',

			// dataset is a browser-only API — using it (or Object.hasOwn on it)
			// breaks Lit SSR where element.dataset is undefined on the server.
			'unicorn/prefer-dom-node-dataset': 'off',

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
			'pnpm-lock.yaml',
			'**/integration',
			// '**/integration/**/*_expected*',
			'**/__fixtures__',
			'CHANGELOG.md',
			'dist',
			// 'labs',
			'./index.ts',
			'**/eslint.config*',

			'**/.dev*',
			'**/.old*',

			'**/starter-projects',

			// CLI package has no source files yet
			'packages/cli/**',

			// Generated / vendor assets in docs
			'docs/website/public/**',
			'docs/website/slightly-wrote-born__tmp_clone/**',

			// Generated/vendor content in labs packages
			'packages/labs/og-images-generator/docs/**',
			'packages/labs/og-images-generator/test/**',
			'packages/labs/og-images-generator/types/**',
			'packages/labs/og-images-generator/demos/**',

			'packages/labs/vite-plugin-jsx-forge/demo',

			'packages/labs/literals/rollup-plugin-html-css-minifier/demo/**',

			'packages/labs/vite-plugin-standard-css-modules/css-modules.d.ts',
			'packages/labs/vite-plugin-standard-css-modules/demo/**',
			'packages/labs/vite-plugin-standard-css-modules/src/test/**',
			'packages/labs/literals/**/test/**',
			'**/__fixtures__/**',
			'packages/labs/jsx-forge/src/_vendor/**',

			/* eslint-disable @typescript-eslint/no-floating-promises */

			'**/*.test.*',
			'**/coverage/**',
			'**/dist/**',

			'./scripts',
		],
	},
	{
		files: [
			'packages/**',
			// 'packages/internal/**',
			// 'packages/{server,client,create-gracile,engine,gracile,cli}/**',
			// 'packages/addons/**',
			// 'packages/labs/**',
		],
		rules: {

						'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
				},
			],
		},
	},
	{
		files: ['packages/labs/hmr/**'],
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
		},
	},
	// {
	// 	files: ['**/test/**'],
	// 	rules: {
	// 		'@typescript-eslint/explicit-function-return-type': 'off',
	// 	},
	// },
	{
		files: ['packages/{engine,server,client}/**'],
		rules: {
			// '@typescript-eslint/explicit-function-return-type': 'error',
		},
	},
	// {
	// 	files: ['packages/labs/og-images-generator/**', 'packages/labs/hmr/**'],
	// 	rules: {
	// 		'@typescript-eslint/explicit-function-return-type': 'off',
	// 	},
	// },

	// TODO: Make stricter progressively
	// Relax rules for docs website
	{
		files: ['docs/website/**'],
		rules: {
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-unused-properties': 'off',
			'unicorn/no-keyword-prefix': 'off',
			'unicorn/consistent-destructuring': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'no-console': 'off',
		},
	},

	// Relax rules for labs (experimental)
	{
		files: ['packages/labs/**'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-unsafe-call': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-unused-properties': 'off',
			'unicorn/no-keyword-prefix': 'off',
			'unicorn/consistent-destructuring': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'no-console': 'off',
		},
	},

	// Files without tsconfig project
	{
		files: [
			'packages/internal/test-utils/**',
			'packages/labs/*/playwright.config.ts',
			'packages/labs/jsx-forge/jsx-bootstrap.ts',
			'packages/labs/css-helpers/ambient.d.ts',
		],
		languageOptions: {
			parserOptions: {
				project: false,
			},
		},
		rules: {
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
		},
	},
];

export default config;
