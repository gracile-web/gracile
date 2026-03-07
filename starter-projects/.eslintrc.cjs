const { join } = require('path');

const tsConfigs = [
  './tsconfig.json',
  //
  './static/tsconfig.json',
].map((p) => join(__dirname, p));

/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
  // root: true,

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
        '@typescript-eslint/no-namespace': 'off',

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
