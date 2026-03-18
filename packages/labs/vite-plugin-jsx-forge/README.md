# <span class=git-only>Gracile — </span>JSX Forge Vite plugin

A [_JSX Forge_](/docs/add-ons/jsx-forge/) convenience wrapper for Vite
projects.  
Compiles JSX/TSX to `html` tagged template literals at build time, using
TypeScript & [ts-patch](https://github.com/nonara/ts-patch).

> [!TIP] You can use this plugin with any Vite+Lit setup!  
> It's totally decoupled from the Gracile framework.

## Installation

```sh
npm i @gracile-labs/vite-plugin-jsx-forge jsx-forge
```

## Setup

### Vite config

```ts
// @filename: /vite.config.ts

import { gracileJsxTs } from '@gracile-labs/vite-plugin-jsx-forge/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    gracileJsxTs(),

    // ...
  ],
});
```

### TypeScript config

[ts-patch](https://github.com/nonara/ts-patch) must be installed and
[prepared](https://github.com/nonara/ts-patch#setup) for the compiler plugin to
work.

```jsonc
// @filename: /tsconfig.json

{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "jsx-forge",

    "plugins": [
      {
        "transform": "jsx-forge/transform",
      },
    ],

    // Should be aligned with Rollup output directory.
    "outDir": "dist",
  },
}
```

### Ambient types

Add the JSX types reference in a `.d.ts` file (or use a
[triple-slash directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)
at the top of your entry files):

```ts
// @filename: /src/ambient.d.ts

/// <reference types="jsx-forge/jsx-runtime" />
```

Or import the ambient types from this package directly:

```ts
/// <reference types="@gracile-labs/vite-plugin-jsx-forge/ambient" />
```

## Usage

JSX is compiled **statically** to Lit `html` tagged templates. This is not a JSX
runtime — think Solid-style compilation, but targeting **Lit** (or any
compatible tagged template library).

### Basic example

```tsx
// @filename: /src/my-template.tsx

const name = 'World';
const el = <span class="greeting">{name}</span>;
```

Compiles to:

```js
import { html } from 'lit';
const name = 'World';
const el = html`<span class="greeting">${name}</span>`;
```

### Custom element rendering

```tsx
// @filename: /src/features/my-element.el.tsx

'use html-signal';

import { customElement } from 'lit/decorators/custom-element.js';
import { LitElement } from 'lit';

@customElement('my-element')
export class MyElement extends LitElement {
  override render() {
    return (
      <>
        <h1>Hello</h1>
        <button on:click={() => console.log('clicked!')}>Click me</button>
      </>
    );
  }
}
```

### Server document

```tsx
// @filename: /src/document.tsx

'use html-server';

export const document = (props: { url: URL; title?: string }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{props.title ?? 'My App'}</title>
    </head>
    <body>
      <route-template-outlet></route-template-outlet>
    </body>
  </html>
);
```

### Template flavor directives

Place a `"use html-*"` directive at the top of a file to control which `html`
tag function is imported:

| Directive           | Import source       | Use case                  |
| ------------------- | ------------------- | ------------------------- |
| _(default)_         | `lit`               | Standard client templates |
| `'use html-server'` | `@lit-labs/ssr`     | Server-side rendering     |
| `'use html-signal'` | `@lit-labs/signals` | Signal-aware templates    |

---

See the full [JSX Forge documentation](/docs/add-ons/jsx-forge/) for the
complete syntax reference (bindings, components, control helpers, etc.).
