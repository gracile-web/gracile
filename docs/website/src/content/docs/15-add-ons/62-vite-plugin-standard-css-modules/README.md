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
3. Each matching import is rewritten to a **virtual module** — e.g.
   `virtual:csm/sheet/<resolved-css-path>` — using `magic-string`. All JS files
   that import the same CSS file (and mode) share the **same virtual module**
   and therefore the **same `CSSStyleSheet` or `CSSResult` instance**, exactly
   like a native CSS module script in the browser.
4. The virtual module's `load` hook generates the bootstrap code:
   - It imports the CSS file with a `?inline` query so Vite processes it through
     its normal CSS pipeline (PostCSS, Sass, etc.) and returns the final CSS
     string.
   - For **client + `type: 'css'`** (`sheet` mode): a single
     `new CSSStyleSheet()` is created and populated with `replaceSync()`.
   - For **`type: 'css-lit'`** or **SSR** (`lit` mode): a single `unsafeCSS()`
     call from `lit` wraps the string into a `CSSResult`.
5. In dev mode, the virtual module injects `import.meta.hot.accept` handlers so
   CSS edits are applied instantly via `CSSStyleSheet.replaceSync()` — no full
   page reload.

### Singleton advantage

Because every importer of `common.css` receives the same module reference, there
is exactly **one** `CSSStyleSheet` (or `CSSResult`) per CSS file — no matter how
many components adopt it. This mirrors native browser behaviour for CSS module
scripts and avoids redundant `unsafeCSS()` calls, duplicate `const` bindings,
and unnecessary GC pressure in large codebases.

## Hot Module Replacement (HMR)

During development (`vite dev`), the plugin provides **graceful CSS swapping** —
editing a CSS/SCSS/Less/… file updates styles in place without a full page
reload.

### How it works

Because CSS is imported via `?inline` (i.e. as a JS string module), a naïve
setup would cause Vite to treat every CSS change as a JS module change,
triggering an expensive full reload. This plugin avoids that by:

1. **Dep-acceptance** — each transformed import gets an
   `import.meta.hot.accept('./styles.css?inline', cb)` block. Vite's default HMR
   propagation sees that the JS module _accepts_ its CSS dependency and calls
   the callback instead of reloading the page.

2. **In-place `replaceSync()`** — the callback calls
   `CSSStyleSheet.replaceSync()` on the _same sheet instance_ that was already
   adopted into shadow roots. Since `adoptedStyleSheets` holds a reference, the
   update is instant and universal — every Web Component using that sheet sees
   the new styles immediately.

3. **Lit `CSSResult` support** — for `type: 'css-lit'` imports, the callback
   accesses the lazily-cached `styleSheet` property on the `CSSResult` and calls
   `replaceSync()` on the underlying `CSSStyleSheet`.

4. **DSD (Declarative Shadow DOM) reconciliation** — in dev mode the plugin
   prepends a CSS comment marker (`/* __csm:/src/path.css */`) to the CSS
   content. A lightweight virtual module (`virtual:standard-css-modules/hmr`)
   traverses open shadow roots and updates any `<style>` elements containing the
   marker. This covers the window between initial SSR delivery and Lit
   hydration, where styles live as plain `<style>` tags rather than
   `adoptedStyleSheets`.

> **No configuration needed** — HMR is automatically enabled during `vite dev`
> and completely absent from production builds.

## Why native CSS scoping makes HMR simpler

Full-stack frameworks like Next.js, Nuxt, Astro, and SvelteKit scope CSS
**synthetically** — they hash class names (`.title` → `.title_abc123`) or inject
attribute selectors (`data-v-xxxx`, `.astro-xxxx`, `.svelte-xxxx`). Because the
framework _is_ the scoping layer, a CSS edit must flow back through the
framework's pipeline: re-extract styles, re-hash class names, and often
re-render the component so the DOM picks up the new identifiers. For shared or
global stylesheets (Tailwind, Bootstrap, etc.), a single token change can force
a full CSS re-parse of the entire concatenated sheet since there is only one
global scope.

With Shadow DOM, the browser is the scoping layer, and
[`adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets)
holds a **live reference** to a `CSSStyleSheet` object. Updating styles reduces
to a single `replaceSync()` call — every shadow root that adopted the sheet sees
the change instantly, with no DOM manipulation, no class-name rebinding, and no
component re-render. The entire HMR implementation in this plugin is roughly 30
lines of generated code.

This mirrors the shift from the Webpack era to modern dev-servers (Snowpack,
`@web/dev-server`, Vite):

| Era                   | Module system                                                       | CSS scoping                                                                              |
| --------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Webpack**           | Bundler emulates ESM (`__webpack_require__`) — complex HMR plumbing | Framework emulates scoping (class hashing, attribute selectors) — complex reconciliation |
| **Vite / native ESM** | Browser runs ESM natively — HMR is trivial module replacement       | Browser runs Shadow DOM natively — HMR is a single `replaceSync()`                       |

By relying on what the platform already provides, both module loading _and_ CSS
scoping become dramatically simpler to hot-update — no framework orchestration
needed, just hand the browser the new content and let the native infrastructure
propagate it.

<!--  -->
