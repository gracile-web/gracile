# Islands

Gracile Islands let you server-render **and** hydrate components from any UI
framework — React, Vue, Svelte, Solid, Preact — inside your Lit SSR pages using
the `<is-land>` custom element.

> [!CAUTION] Experimental. This add-on is under active development and its API
> may change.

## Concept

The Islands pattern lets you embed interactive "islands" of rich UI inside an
otherwise statically rendered page. Each island is independently server-rendered
during SSR and selectively hydrated on the client.

Gracile Islands builds on top of the Lit SSR
[`ElementRenderer`](https://lit.dev/docs/ssr/overview/) API, registering a
custom renderer for the `<is-land>` tag that delegates rendering to
framework-specific adapters.

## Installation

```sh
npm i @gracile-labs/islands
```

You also need the Vite plugin(s) for any framework you want to use. For example,
to use React and Vue islands:

```sh
npm i @vitejs/plugin-react @vitejs/plugin-vue react react-dom vue
```

## Setup

### 1. Add the Vite plugin

In your `vite.config.ts`, add `gracileIslands()` **after** the main `gracile()`
plugin and any framework plugins:

```ts
// @filename: ./vite.config.ts

import { gracile } from '@gracile/gracile/plugin';
import { gracileIslands } from '@gracile-labs/islands';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({ include: ['**/*.react.{js,jsx,ts,tsx}'] }),
    vue(),
    gracile({
      /* ... */
    }),
    gracileIslands({ debug: true }),
  ],
});
```

### 2. Create an island registry

Create an `islands.config.ts` file at the root of your project. This file maps
island names to their framework components and tells the server how to render
them:

```ts
// @filename: ./islands.config.ts

import { defineReactIslands } from '@gracile-labs/islands/react/define';
import { defineVueIslands } from '@gracile-labs/islands/vue/define';

import MyReactForm from './src/components/my-form.react';
import MyVueWidget from './src/components/my-widget.vue';

export default {
  ...defineReactIslands({ MyReactForm }),
  ...defineVueIslands({ MyVueWidget }),
};
```

The `define*Islands` helpers use **conditional exports** — the `node` (server)
export renders to a static HTML string, while the `browser` (client) export
hydrates the component in-place.

### 3. Add the client entry

```ts
// @filename: ./src/document.client.ts

import '@gracile-labs/islands/client';
```

## Usage in routes

```ts
// @filename: ./src/routes/(home).ts

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';

export default defineRoute({
  document: (context) => document(context),

  template: () => html`
    <h1>My Page</h1>
    <is-land load="MyReactForm"></is-land>
    <is-land load="MyVueWidget"></is-land>
  `,
});
```

### Passing props

```ts
html`
  <is-land
    load="MyReactForm"
    props="${JSON.stringify({ title: 'Contact Us' })}"
  ></is-land>
`;
```

### Light DOM rendering

```ts
html`<is-land load="MyVueWidget" light></is-land>`;
```

## Supported frameworks

| Framework | Server define                         |
| --------- | ------------------------------------- |
| React     | `@gracile-labs/islands/react/define`  |
| Vue       | `@gracile-labs/islands/vue/define`    |
| Svelte    | `@gracile-labs/islands/svelte/define` |
| Solid     | `@gracile-labs/islands/solid/define`  |
| Preact    | `@gracile-labs/islands/preact/define` |

> [!TIP] When using **Solid**, you also need to include
> `generateHydrationScript()` in your document `<head>` for hydration to work
> properly.

## How it works

1. The `gracileIslands()` Vite plugin loads `islands.config.ts` at server
   startup and registers a Lit SSR `ElementRenderer` for the `<is-land>` tag.
2. During SSR, Lit encounters `<is-land>` elements and delegates to the
   `GenericIslandRenderer`, which calls the framework's server-side render
   function.
3. On the client, the `<is-land>` custom element hydrates itself by looking up
   the component in the registry and calling the framework's client-side hydrate
   function.
