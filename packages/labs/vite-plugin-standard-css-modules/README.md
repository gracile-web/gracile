# <span class=git-only>Gracile — </span>Standard CSS Modules (Vite plugin)<i-c o=ph:flask></i-c>

Use [import attributes](https://tc39.es/proposal-import-attributes/) in Vite to
get a
[`CSSStyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)
or a Lit [`CSSResult`](https://lit.dev/docs/api/styles/#CSSResult) from your CSS
files.

```ts
// Standard CSS module — returns a CSSStyleSheet (client) or CSSResult (SSR)
import styles from './my-element.css' with { type: 'css' };

// Lit-specific — always returns a CSSResult
import styles from './my-element.css' with { type: 'css-lit' };
```

Works with **CSS**, **SCSS**, **Sass**, **Less**, **Stylus**, and **PostCSS** —
anything Vite can process.

> [!CAUTION]  
> Experimental. This add-on is under active development and its API may change.

## Concept

The [CSS Module Scripts](https://web.dev/articles/css-module-scripts) proposal
lets you import `.css` files as constructable `CSSStyleSheet` objects using
`import … with { type: 'css' }`. Browser support is growing but bundlers don't
handle it natively yet.

This Vite plugin bridges the gap: it rewrites CSS import attributes at build
time so you can use the standard syntax today — with full support for Vite's CSS
pipeline (PostCSS, Sass, Less, etc.) and automatic SSR fallback via Lit's
`unsafeCSS()`.

## Installation

```sh
npm i vite-plugin-standard-css-modules
```

> **Peer dependencies**
>
> - `vite` (5.x, 6.x, 7.x, or 8.x)
> - `lit` (3.x) — optional, required only when using `type: 'css-lit'` or SSR

## Setup

Add the plugin to your Vite (or Astro, Gracile, SvelteKit, etc.) config:

```ts
// vite.config.ts
import { standardCssModules } from 'vite-plugin-standard-css-modules';

export default {
  plugins: [standardCssModules()],
};
```

## Usage

### `type: 'css'` — Constructable stylesheet

On the **client**, the import is transformed into a
[constructable `CSSStyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/CSSStyleSheet)
populated via `replaceSync()`:

```ts
import styles from './my-element.css' with { type: 'css' };

class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [styles];
  }
}
```

During **SSR**, `CSSStyleSheet` doesn't exist in Node.js. The plugin
automatically falls back to Lit's `unsafeCSS()`, returning a `CSSResult` instead
— no config needed.

### `type: 'css-lit'` — Lit `CSSResult`

Always returns a Lit `CSSResult`, on both client and server. Use this when you
want a `CSSResult` everywhere (e.g. for Lit's static `styles`):

```ts
import { LitElement, html } from 'lit';
import styles from './my-element.css' with { type: 'css-lit' };

class MyElement extends LitElement {
  static styles = [styles];
  render() {
    return html`<p>Hello</p>`;
  }
}
```

Lit handles both `CSSStyleSheet` and `CSSResult` in `static styles`, so you can
mix `type: 'css'` and `type: 'css-lit'` imports freely.

## Options

```ts
standardCssModules({
  include: ['**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}'], // default
  exclude: ['**/node_modules/**'], // default
  outputMode: undefined, // default — auto-detect per import
  log: false, // default
});
```

| Option       | Type                               | Description                                                                                                              |
| ------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `include`    | `string[]`                         | Glob patterns for JS/TS files to transform.                                                                              |
| `exclude`    | `string[]`                         | Glob patterns to skip.                                                                                                   |
| `outputMode` | `'CSSStyleSheet'` \| `'CSSResult'` | Force **every** CSS import to produce a specific output, overriding per-import `type` attributes and SSR auto-detection. |
| `log`        | `boolean`                          | Print each transformed import to the console.                                                                            |

### `outputMode`

By default the plugin decides per import:

- `type: 'css'` on the client → `CSSStyleSheet`
- `type: 'css'` during SSR → `CSSResult` (automatic fallback)
- `type: 'css-lit'` → `CSSResult` everywhere

Setting `outputMode` overrides this globally:

```ts
// Always emit CSSResult (Lit's unsafeCSS), even on the client
standardCssModules({ outputMode: 'CSSResult' });

// Always emit CSSStyleSheet, even during SSR
// (make sure a CSSStyleSheet polyfill is available server-side)
standardCssModules({ outputMode: 'CSSStyleSheet' });
```

## Pre/post-processors

All of Vite's CSS pipelines work out of the box. Import SCSS, Sass, Less,
Stylus, or PostCSS files with the same syntax:

```ts
import tokens from './tokens.scss' with { type: 'css' };
import theme from './theme.less' with { type: 'css-lit' };
```

## TypeScript / IDE awareness

Add a triple-slash reference so your editor resolves CSS default imports as
`CSSStyleSheet`:

```ts
// src/vite-env.d.ts  (or src/env.d.ts for Astro)

/// <reference types="vite-plugin-standard-css-modules/css-modules" />
/// <reference types="vite/client" />
```

See [css-modules.d.ts](./css-modules.d.ts) for the full list of declared
extensions.

## How it works

1. The plugin's `transform` hook runs with `enforce: 'pre'`.
2. OXC's parser (`oxc-parser`) scans the file's AST for `ImportDeclaration`
   nodes with a `with { type: 'css' | 'css-lit' }` attribute on a CSS-like file.
3. Each matching import is rewritten using `magic-string`:
   - The CSS specifier gets a `?inline` query appended so Vite processes it
     through its normal CSS pipeline (PostCSS, Sass, etc.) and returns the final
     CSS string.
   - For **client + `type: 'css'`**: a `new CSSStyleSheet()` is created and
     populated with `replaceSync()`.
   - For **`type: 'css-lit'`** or **SSR**: `unsafeCSS()` from `lit` wraps the
     string into a `CSSResult`.
4. A `handleHotUpdate` hook invalidates JS modules when their imported CSS files
   change.

<!--  -->
