# Gracile Starter — Minimal HMR

A minimal Gracile static project with Web Components HMR (Hot Module Replacement) enabled.

Edit Lit element templates and styles and see changes reflected instantly without page reload.

## Getting started

```sh
pnpm install
pnpm dev
```

Then edit `src/features/my-greetings.ts` — changes to the template and styles will hot-replace in the browser.

## Configuration

The HMR plugin is configured in `vite.config.ts`:

```ts
import { hmrPlugin, presets } from '@gracile-labs/hmr';

// in plugins array:
hmrPlugin({
  include: ['src/**/*.ts'],
  presets: [presets.lit],
}),
```
