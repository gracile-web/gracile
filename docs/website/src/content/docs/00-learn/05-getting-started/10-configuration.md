# <i-c o='ph:gear-duotone'></i-c>Configuration

There aren't many things (yet) to configure with Gracile, and most of your endeavors are achievable by interacting with the Vite/Rollup plugin pipeline.

## Configuration file

The `vite.config` (`.js` or `.ts`) is where you put the Gracile plugin specifics and Vite options.  
It can be a **TypeScript** or a **JavaScript** file.

```ts twoslash
// @filename: /vite.config.ts

import { defineConfig } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

export default defineConfig({
  server: {
    port: 4567,
  },
  plugins: [gracile()],
});
```

### Capabilities

#### TypeScript

Under the hood, The TypeScript code and **all imported modules** get transpiled on the fly, that's it:
You can enjoy writing your own plugins here with parity with
your application code regarding type-safety and with easy module sharing (think app-wide constants).

#### Automatic-reloading

Every time the configuration is changed or when its imported modules get updated, Gracile will reload itself.  
This also works for third parties in the `node_modules` folder.

## Directory structure

The bare minimum is a `src/routes/<...>.ts` file.

<div class="file-tree">

- my-project/
  - vite.config.ts _- Vite and Gracile project configuration_.
  - public/ _- Static assets_.
    - favicon.svg
  - src/
    - ambient.d.ts _- Vite, Gracile, etc. environmental types_.
    - routes/
      - index.ts _- At least one route is required_.
      - foo/
        - (the-foo-index).ts
        - [myParam].ts
        - bar/
          - [...restParams].ts
  - ...

</div>

You will need to [define and put a default `document`](/docs/learn/usage/defining-base-document/) somewhere, too. For example as `src/document.ts`.

There are **no other** directory structure conventions besides the file router, the root config. and the `public` assets folder.
