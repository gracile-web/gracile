# <span class=git-only>Gracile — </span>JSX Forge (Vite plugin)

A [_JSX Forge_](/docs/add-ons/jsx-forge/) convenience wrapper for Vite
projects.  
Compiles JSX/TSX to `html` tagged template literals at build time, using
TypeScript & [ts-patch](https://github.com/nonara/ts-patch).

> [!TIP]  
> You can use this plugin with any Vite+Lit setup!  
> It's totally decoupled from the Gracile framework.

## Installation

```sh
npm i @gracile-labs/vite-plugin-jsx-forge jsx-forge
```

## Setup

### Vite config

```ts
// @filename: /vite.config.ts

import { gracileJsxToLiterals } from '@gracile-labs/vite-plugin-jsx-forge/to-literals';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    gracileJsxToLiterals(),

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

<!-- NOTE: I think this is blatantly wrong -->
<!-- ### Ambient types

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
``` -->

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

### Options

```ts
gracileJsxToLiterals({
  /** Use a full TS LanguageService for type-aware transforms. Default: true */
  typeAware: true,

  /** Path to tsconfig (resolved from project root). Default: 'tsconfig.json' */
  tsconfig: 'tsconfig.json',
});
```

#### `typeAware` (default: `true`)

When **enabled**, the plugin maintains a TypeScript LanguageService that
provides a type checker. This enables:

- **Automatic boolean bindings** — `disabled={flag}` → `?disabled=${flag}` when
  `flag` is typed `boolean`.
- **Automatic `ifDefined()` wrapping** — `title={val}` →
  `title=${ifDefined(val)}` when `val` is typed `T | undefined`.
- **Spread attribute expansion** — `{...props}` is expanded into individual
  attribute bindings using the type checker.

When set to **`false`**, the transform is purely syntactic (no type checker).
This is significantly faster (~20× on incremental saves) but requires you to use
**explicit namespace prefixes** for special bindings:

| Prefix   | Lit binding   | Example                     |
| -------- | ------------- | --------------------------- |
| `bool:`  | `?attr`       | `<input bool:checked={v}/>` |
| `if:`    | `ifDefined()` | `<a if:href={maybeUrl}>`    |
| `on:`    | `@event`      | `<button on:click={fn}>`    |
| `.prop:` | `.property`   | `<el .prop:items={list}>`   |

Spread attributes are **skipped** in syntactic mode (a console warning is
emitted).

### Benchmarks

| Scenario                           | median  | mean      | p95      | min     | max      |
| ---------------------------------- | ------- | --------- | -------- | ------- | -------- |
| **Cold start .tsx** (type-aware)   | —       | 1186.6 ms | —        | —       | —        |
| **Cold start .tsx** (syntactic)    | —       | 34.9 ms   | —        | —       | —        |
| **Cold start .ts**                 | —       | 11.3 ms   | —        | —       | —        |
| **Warm request .tsx** (type-aware) | 2.0 ms  | 2.1 ms    | 3.3 ms   | 1.4 ms  | 3.3 ms   |
| **Warm request .tsx** (syntactic)  | 1.7 ms  | 1.7 ms    | 2.8 ms   | 1.2 ms  | 2.8 ms   |
| **Warm request .ts** (baseline)    | 2.9 ms  | 3.4 ms    | 12.0 ms  | 2.2 ms  | 12.0 ms  |
| **Incremental .tsx** (type-aware)  | 95.9 ms | 103.3 ms  | 153.4 ms | 89.1 ms | 153.4 ms |
| **Incremental .tsx** (syntactic)   | 5.8 ms  | 6.1 ms    | 8.7 ms   | 5.0 ms  | 8.7 ms   |
| **Incremental .ts** (baseline)     | 4.5 ms  | 4.7 ms    | 5.7 ms   | 4.0 ms  | 5.7 ms   |

---

See the full [JSX Forge documentation](/docs/add-ons/jsx-forge/) for the
complete syntax reference (bindings, components, control helpers, etc.).
