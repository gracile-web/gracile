# rollup-plugin-minify-html-literals

[![npm](https://img.shields.io/npm/v/%40literals%2Frollup-plugin-html-css-minifier.svg)](https://www.npmjs.com/package/%40literals%2Frollup-plugin-html-css-minifier)

<!-- [![Build Status](https://travis-ci.com/asyncLiz/rollup-plugin-minify-html-literals.svg?branch=master)](https://travis-ci.com/asyncLiz/rollup-plugin-minify-html-literals) -->
<!-- [![Coverage Status](https://coveralls.io/repos/github/asyncLiz/rollup-plugin-minify-html-literals/badge.svg?branch=master)](https://coveralls.io/github/asyncLiz/rollup-plugin-minify-html-literals?branch=master) -->

Uses [minify-html-literals](https://www.npmjs.com/package/minify-html-literals)
to minify HTML and CSS markup inside JavaScript template literal strings.

## Usage

> [!IMPORTANT]  
> All `@literals/*` packages are published as **ESM-only**!

```js
import babel from 'rollup-plugin-babel';
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import { uglify } from 'rollup-plugin-uglify';

export default {
  entry: 'index.js',
  dest: 'dist/index.js',
  plugins: [
    literalsHtmlCssMinifier(),
    // Order plugin before transpilers and other minifiers
    babel(),
    uglify(),
  ],
};
```

By default, this will minify any tagged template literal string whose tag
contains "html" or "css" (case insensitive).
[Additional options](https://www.npmjs.com/package/@literals/html-css-minifier#options)
may be specified to control what templates should be minified.

## Options

```js
export default {
  entry: 'index.js',
  dest: 'dist/index.js',
  plugins: [
    minifyHTML({
      // minimatch of files to minify
      include: [],
      // minimatch of files not to minify
      exclude: [],
      // set to `true` to abort bundling on a minification error
      failOnError: false,
      // minify-html-literals options
      // https://www.npmjs.com/package/@literals/html-css-minifier#options
      options: null,

      // Advanced Options
      // Override minify-html-literals function
      minifyHTMLLiterals: null,
      // Override @rollup/pluginutils filter from include/exclude
      filter: null,
    }),
  ],
};
```

## Examples

### Minify Polymer Templates

```js
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import { defaultShouldMinify } from '@literals/html-css-minifier';

export default {
  entry: 'index.js',
  dest: 'dist/index.js',
  plugins: [
    minifyHTML({
      options: {
        shouldMinify(template) {
          return (
            defaultShouldMinify(template) ||
            template.parts.some((part) => {
              // Matches Polymer templates that are not tagged
              return (
                part.text.includes('<style') ||
                part.text.includes('<dom-module')
              );
            })
          );
        },
      },
    }),
  ],
};
```
