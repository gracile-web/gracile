# @gracile-labs/hmr

Web Components HMR (Hot Module Replacement) Vite plugin for [Gracile](https://gracile.js.org).

Enables granular hot replacement for Lit, FAST Element, Haunted, and vanilla web components during development — updating templates and styles without full page reloads.

## Credits

This package is derived from:

- **[vite-plugin-web-components-hmr](https://github.com/fi3ework/vite-plugin-web-components-hmr)** by [@fi3ework](https://github.com/fi3ework) — MIT License
  - Which is itself a fork of **[@open-wc/dev-server-hmr](https://github.com/open-wc/open-wc/tree/master/packages/dev-server-hmr)** by [Open Web Components](https://open-wc.org/) — MIT License

The source was extracted and converted to ESM for long-term maintainability within the Gracile ecosystem.

## Usage

```ts
// vite.config.ts
import { gracile } from '@gracile/gracile/plugin';
import { hmrPlugin, presets } from '@gracile-labs/hmr';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    gracile(),
    hmrPlugin({
      include: ['src/**/*.ts'],
      presets: [presets.lit],
    }),
  ],
});
```

## Available presets

- `presets.lit` — for `lit` (v2+)
- `presets.litElement` — for `lit-element` (v1)
- `presets.fastElement` — for `@microsoft/fast-element`
- `presets.haunted` — for `haunted`

## License

ISC (this package) / MIT (upstream sources)
