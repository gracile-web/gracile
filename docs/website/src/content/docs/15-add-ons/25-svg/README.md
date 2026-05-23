# SVG

Import, auto-optimize, and inline SVG files in your HTML templates. Uses SVGO
under the hood.

## Usage

```ts
// @filename: /src/modules/my-partial.ts

import { html } from 'lit';

import myIcon from '../assets/icons/my-icon.svg';

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
> You can use this extension with any Vite+Lit setup!  
> It's totally decoupled from the framework.

```ts
// @filename: /vite.config.ts

import { defineConfig } from 'vite';

import { viteSvgPlugin } from '@gracile/svg/vite';

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
