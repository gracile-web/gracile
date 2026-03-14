# SVG

Import, auto-optimize, and inline SVG files in your HTML templates.
Uses SVGO under the hood.

## Usage

```ts twoslash
// @filename: /src/modules/my-partial.ts

import { html } from 'lit';

import myIcon from '../assets/icons/my-icon.svg'; // [!code highlight]

export const myPartial = html`
  <!-- -->
  <div>${myIcon}</div>
`;
```

## Installation

```sh
npm i @gracile/svg
```

> [!TIP]
> You can u**se this extension with any Vite+Lit setup**!  
> It's totally decoupled from the framework.

```ts twoslash
// @filename: /vite.config.ts

import { defineConfig } from 'vite';

import { viteSvgPlugin } from '@gracile/svg/vite'; // [!code highlight]

export default defineConfig({
  // ...

  plugins: [
    viteSvgPlugin({
      // NOTE: SVGO options…
    }),
    // ...
  ],
});
```

See the [optimizations options for SVGO](https://github.com/svg/svgo).
