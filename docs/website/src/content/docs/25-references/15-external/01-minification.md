# Minification

Besides your JS and CSS bundles, you still have the HTML output and its embedded
CSS/JS to take care of.

HTML template literals are leaved as-is with Gracile, this is because HTML
minification is a tedious process that requires awareness about potential
issues.

It's not always worth the trouble to do it, but if you want to squeeze as many
bits as possible, you have multiple options.

For example, you can use the
[@literals/rollup-plugin-html-css-minifier](https://github.com/JulianCataldo/literals)
Rollup plugin.

```sh
npm i @literals/rollup-plugin-html-css-minifier
```

```ts
// @filename: ./vite.config.ts

import { defineConfig, type PluginOption } from 'vite';
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import { gracile } from '@gracile/gracile/plugin';

export default defineConfig({
  // ...
  plugins: [
    gracile(),
    // ...
    literalsHtmlCssMinifier({
      options: {
        // ...
      },
    }),
  ],
});
```

The static HTML pre-renders and `html` templates in JS will then be properly
minified.  
It works during **development and build**, for the **client and the server
bundles**.
