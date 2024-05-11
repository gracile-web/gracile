/** @type {import("@types/eslint").Linter.Config} */

const tsConfigs = [
  './packages/gracile/tsconfig.json',

  './packages/client/tsconfig.json',
  './packages/server/tsconfig.json',

  './packages/engine/tsconfig.json',
  './packages/cli/tsconfig.json',

  './packages/create-gracile/tsconfig.json',

  './packages/internal/utils/tsconfig.json',

  './packages/addons/svg/tsconfig.json',
  './packages/addons/sitemap/tsconfig.json',
  './packages/addons/markdown/tsconfig.json',
  // './packages/addons/labs/minify/tsconfig.json',
  './packages/addons/markdown-preset-marked/tsconfig.json',
  './packages/addons/metadata/tsconfig.json',
  './integration/tsconfig.json',
];

module.exports = {
  settings: {
    // This loads <rootdir>/tsconfig.json to eslint
    'import/resolver': {
      typescript: {
        project: tsConfigs,
      },
    },
  },

  ignorePatterns: ['**/dist/**', '*.js', '*.cjs'],
  // env: {
  //   node: true,
  //   es2022: true,
  //   browser: true,
  // },

  overrides: [
    // {
    //   files: ['*.json'],
    //   plugins: ['json-files'],
    //   rules: {
    //     'sort-package-json': 'warn',
    //   },
    // },
    {
      files: ['*.ts', '*.mts', '*.cts'],
      plugins: [
        //
        'eslint-plugin-tsdoc',
        '@typescript-eslint',
        'simple-import-sort',
        'regex',
      ],

      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsConfigs, // Specify it only for TypeScript files
        ecmaVersion: 'latest',
        sourceType: 'module',
      },

      extends: [
        'airbnb-base',
        'airbnb-typescript',

        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',

        'prettier',
      ],

      rules: {
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',

        'tsdoc/syntax': 'warn',
        // Not working :(
        // 'tsdoc/syntax/tsdoc-unnecessary-backslash': 'off',
        // 'tsdoc/syntax/tsdoc-undefined-tag': 'off',

        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',

        'max-lines': [
          'warn',
          { max: 250, skipComments: true, skipBlankLines: true },
        ],

        'react/jsx-filename-extension': 'off',

        'import/prefer-default-export': 'off',

        'import/extensions': 'off',

        'prefer-destructuring': 'off',
        // 'import/extensions': [
        //   'error',
        //   'ignorePackages',
        //   {
        //     js: 'never',
        //     jsx: 'never',
        //     ts: 'never',
        //     tsx: 'never',
        //   },
        // ],
        'import/order': 'off',

        'arrow-body-style': 'off',
      },
    },
  ],
};
