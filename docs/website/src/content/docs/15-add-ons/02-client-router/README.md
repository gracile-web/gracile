# Client-side router<i-c o='ph:flask'></i-c>

Quickly add a description, title, open graph, etc. in your page's document head.  
This add-on will take care of the nitty-gritty.

> [!CAUTION]
> Experimental.
> This is not well tested, nor it is customizable enough.

## Installation

```sh
npm i @gracile-labs/client-router
```

Activate [page premises](/docs/learn/usage/progressive-interactivity/#doc_expose-the-page-premises/):

```ts
// @filename: ./vite.config.ts

import { defineConfig, type PluginOption } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

export default defineConfig({
  // ...
  plugins: [
    gracile({
      pages: { premises: { expose: true } }, // [!code highlight:1]
    }),
    // ...
  ],
});
```

## Usage

After installing the `@gracile-labs/client-router`, you can create a client router instance and add it to your document client scripts:

```ts
// @filename: ./src/client-router.ts

import { createRouter } from '@gracile-labs/client-router/create';

// TIP: As an event target, you can listen to events or navigate programmatically from anywhere.
export const router = createRouter();

// @filename: ./src/document.client.ts

import './client-router.js';

// @filename: ./src/routes/(home).ts

import { router } from '../client-router.js';

// ...
if (!isServer) {
  // ...

  // NOTE: Trigger as soon as a new URL is requested.
  router.addEventListener('route-changed', () => {
    this.isSearchBoxVisible = false;
  });

  // NOTE: Trigger when the route template is fully rendered and displayed.
  router.addEventListener('route-rendered', () =>
    requestIdleCallback(() => initCardsHover()),
  );

  // NOTE: Programmatic navigation.
  setTimeout(() => {
    router.navigate('/docs/');
  }, 2000);
}
```

<!-- ---

See the [full API reference](/docs/references/api/add-ons/client-router/). -->
