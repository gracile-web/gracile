# <span class=git-only>Gracile — </span>Babel JSX to Literals Vite plugin

A [_Babel JSX to Literals_](/docs/add-ons/jsx/) convenience wrapper for Vite
projects.  
Compiles JSX/TSX to `html` tagged template literals at build time, using
[Babel](https://babeljs.io/) and
[@gracile-labs/babel-plugin-jsx-to-literals](https://github.com/gracile-web/gracile/tree/main/packages/labs/babel-plugin-jsx-to-literals).

> [!TIP] You can use this plugin with any Vite+Lit setup!  
> It's totally decoupled from the Gracile framework.

> [!NOTE]  
> This is the **Babel-based** approach. For a newer, native TS compiler plugin
> alternative, see
> [@gracile-labs/vite-plugin-jsx-forge](https://github.com/gracile-web/gracile/tree/main/packages/labs/vite-plugin-jsx-forge)
> (based on [ts-patch](https://github.com/nonara/ts-patch)).

## Installation

```sh
npm i @gracile-labs/vite-plugin-babel-jsx-to-literals @gracile-labs/babel-plugin-jsx-to-literals
```

## Setup

### Vite config

```ts
// @filename: /vite.config.ts

import { gracileJsx } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    gracileJsx(),

    // ...
  ],
});
```

You can pass custom options to the underlying Babel plugin:

```ts
gracileJsx({
  babelPlugin: {
    autoImports: true,
    // Override import mappings, etc.
  },
});
```

### TypeScript config

```jsonc
// @filename: /tsconfig.json

{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@gracile-labs/babel-plugin-jsx-to-literals",
  },
}
```

### Ambient types

Add the JSX types reference in a `.d.ts` file (or use a
[triple-slash directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)
at the top of your entry files):

```ts
// @filename: /src/ambient.d.ts

/// <reference types="@gracile-labs/babel-plugin-jsx-to-literals/jsx-runtime" />
```

Or import the ambient types from this package directly:

```ts
/// <reference types="@gracile-labs/vite-plugin-babel-jsx-to-literals/ambient" />
```

## Usage

JSX is compiled **statically** to Lit `html` tagged templates via Babel. This is
not a JSX runtime — think Solid-style compilation, but targeting **Lit** (or any
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

### Attribute bindings

```tsx
<input
  class="toggle"
  type="checkbox"
  prop:checked={todo.completed}
  on:input={(e) => store.toggle(todo.id, e.currentTarget.checked)}
/>
```

Compiles to:

```js
html`<input
  class="toggle"
  type="checkbox"
  .checked=${todo.completed}
  @input=${(e) => store.toggle(todo.id, e.currentTarget.checked)}
/>`;
```

| Prefix       | Output                      | Use case                   |
| ------------ | --------------------------- | -------------------------- |
| `prop:`      | `.property=${…}`            | Lit property binding       |
| `on:`        | `@event=${…}`               | DOM / custom event         |
| `bool:`      | `?attr=${…}`                | Lit boolean attribute      |
| `attr:`      | `attr=${JSON.stringify(…)}` | Serialized attribute (SSR) |
| `if:`        | `attr=${ifDefined(…)}`      | Conditional attribute      |
| `class:map`  | `class=${classMap(…)}`      | Class map directive        |
| `class:list` | `class=${clsx(…)}`          | Class list (via clsx)      |
| `style:map`  | `style=${styleMap(…)}`      | Style map directive        |

### Control helpers

```tsx
import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';
import { Show } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/show';

const el = (
  <ul>
    <For each={items} key={({ id }) => id}>
      {(item) => <li>{item.name}</li>}
    </For>
  </ul>
);

const header = (
  <Show when={isLoggedIn}>
    <span>Welcome back!</span>
  </Show>
);
```

### Template flavor directives

Place a `"use html-*"` directive at the top of a file to control which `html`
tag function is imported:

| Directive           | Import source                  | Use case                  |
| ------------------- | ------------------------------ | ------------------------- |
| _(default)_         | `lit`                          | Standard client templates |
| `'use html-server'` | `@gracile/gracile/server-html` | Server-side rendering     |
| `'use html-signal'` | `@lit-labs/signals`            | Signal-aware templates    |

### Auto-imports

All runtime imports (`html`, `ref`, `classMap`, `styleMap`, `repeat`,
`ifDefined`, `unsafeHTML`, etc.) are **injected automatically** based on usage —
you never need to import directives manually.

---

See the full
[babel-plugin-jsx-to-literals documentation](https://github.com/gracile-web/gracile/tree/main/packages/labs/babel-plugin-jsx-to-literals)
for the complete syntax reference (bindings, components, control helpers, etc.).
