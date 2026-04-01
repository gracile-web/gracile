# CSS helpers

Helpers for Custom Elements with Shadow DOM and SSR (Declarative Shadow DOM).
These address two common friction points: **duplicated inline `<style>` blocks**
in DSD output, and **sharing light-DOM stylesheets** inside shadow roots.

Both helpers define a lightweight Custom Element that runs synchronously during
HTML parse. No FOUC.

> [!CAUTION] Experimental. API surface may change.

> [!TIP] You can use these helpers with any Vite+Lit SSR setup! They are totally
> decoupled from the Gracile framework.

---

## 1. DSD Style Deduplication

When Lit SSR renders multiple instances of the same component, each gets an
identical `<style>` block inside its `<template shadowrootmode>`. This helper
keeps the styles only for the **first** occurrence and replaces subsequent ones
with an `<adopt-shared-style>` reference that adopts a cached `CSSStyleSheet`.

### Vite plugin (recommended)

```ts
// vite.config.ts
import { gracile } from '@gracile/gracile/plugin';
import { dsdStyleDedup } from '@gracile-labs/css-helpers/shared/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [gracile(), dsdStyleDedup()],
});
```

This automatically:

- Registers the `DedupLitElementRenderer` into Gracile's SSR pipeline.
- Injects the `<adopt-shared-style>` CE definition `<script>` into every page's
  `<head>`.

### SSR template snippet (manual)

If you prefer explicit control, you can inline the CE definition yourself and
register the renderer manually. Here, an example with Gracile:

```ts
// Document template
import { SharedStyleProvider } from '@gracile-labs/css-helpers/shared/shared-style-provider';
import { html } from '@gracile/gracile/server-html';

export const document = () => html`
  <!doctype html>
  <html lang="en">
    <head>
      ${SharedStyleProvider()}
    </head>
    <body>
      <route-template-outlet></route-template-outlet>
    </body>
  </html>
`;
```

```ts
// Gracile config — register renderer via user config
import { DedupLitElementRenderer } from '@gracile-labs/css-helpers/shared/dedup-renderer';

gracile({
  litSsr: {
    renderInfo: { elementRenderers: [DedupLitElementRenderer] },
  },
});
```

### How it works

| Occurrence                | SSR output                                                         | Browser behavior                                               |
| ------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| **First** `<my-button>`   | `<style id="__lit-s-my-button">…</style>` + `<adopt-shared-style>` | CE finds sibling `<style>`, creates & caches a `CSSStyleSheet` |
| **Second+** `<my-button>` | `<adopt-shared-style style-id="__lit-s-my-button">` (no `<style>`) | CE pushes the cached sheet to `adoptedStyleSheets`             |

The `<adopt-shared-style>` element removes itself after running.

---

## 2. Global Styles Adopter

Adopts every light-DOM stylesheet (those referenced via `<link>` in the
document) into a given shadow root. Useful for sharing your own ubiquitous
styles or vendored CSS frameworks (Bootstrap, Tailwind…).

Shares goals with the
["Open Stylable" proposal](https://github.com/WICG/webcomponents/issues/909) and
draws from
[Eisenberg's pattern](https://eisenbergeffect.medium.com/using-global-styles-in-shadow-dom-5b80e802e89d).

### Vite plugin (recommended)

```ts
// vite.config.ts
import { gracile } from '@gracile/gracile/plugin';
import { globalStylesAdopter } from '@gracile-labs/css-helpers/global/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [gracile(), globalStylesAdopter()],
});
```

### SSR template snippet (manual)

Here, an example with Gracile:

```ts
import { GlobalStylesProvider } from '@gracile-labs/css-helpers/global/provider';
import { html } from '@gracile/gracile/server-html';

export const document = () => html`
  <!doctype html>
  <html lang="en">
    <head>
      <link rel="stylesheet" href="..." />
      ${GlobalStylesProvider()}
    </head>
    <body>
      <route-template-outlet></route-template-outlet>
    </body>
  </html>
`;
```

### Usage in components

Place `<adopt-global-styles>` before any other content in your shadow root:

```ts
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-greetings')
export class MyGreetings extends LitElement {
  render() {
    return html`
      <adopt-global-styles></adopt-global-styles>

      <div class="my-global-class">Hello!</div>
    `;
  }
}
```

The `<adopt-global-styles>` element removes itself after adopting.

---

## Installation

```sh
npm i @gracile-labs/css-helpers
```

<!-- Ambient types are available via `@gracile-labs/css-helpers/ambient` for internal use. -->
