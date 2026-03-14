# Sitemap

Generate a site map for the web crawlers to collect.

## Installation

```sh
npm i @gracile/sitemap
```

```ts twoslash
// @filename: /vite.config.ts

import { defineConfig } from 'vite';

import { viteSitemapPlugin } from '@gracile/sitemap/vite'; // [!code highlight]

const SITE_URL = 'https://example.com/';

export default defineConfig({
  // ...

  plugins: [
    viteSitemapPlugin({
      // IMPORTANT: This is mandatory.
      siteUrl: SITE_URL,
      // NOTE: This is the default robots.txt that you can override if needed.
      robotsTxt: [
        ['User-agent', '*'],
        ['Allow', '/'],
        ['Sitemap', `${SITE_URL}sitemap.xml`],
      ],
    }),
    // ...
  ],
});
```

---

Based on [sitemap](https://github.com/ekalinin/sitemap.js).
