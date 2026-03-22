# JSX Forge (TS transformer)<i-c o=ph:flask></i-c><!-- omit in toc -->

A JSX to `html` template literals TypeScript compiler transformer.

> **Status**: Experimental — successor to
> [`@gracile-labs/babel-plugin-jsx-to-literals`](https://github.com/user/babel-plugin-jsx-to-literals).  
> Built
> as a native TS compiler plugin (via
> [ts-patch](https://github.com/nonara/ts-patch)), replacing the previous
> Babel-based approach.

<div class="git-only">

---

- [Specs — JSX → HTML tagged template compiler](#specs--jsx--html-tagged-template-compiler)
  - [JSX Syntax](#jsx-syntax)
    - [Basic elements](#basic-elements)
    - [Fragments](#fragments)
    - [Nested elements](#nested-elements)
    - [Void elements](#void-elements)
    - [Expression children](#expression-children)
    - [HTML comments](#html-comments)
  - [Attributes \& Bindings](#attributes--bindings)
    - [Static attributes](#static-attributes)
    - [Expression attributes](#expression-attributes)
    - [Property binding (`_:`)](#property-binding-_)
    - [Event binding (`on:`)](#event-binding-on)
    - [Boolean binding (`bool:`)](#boolean-binding-bool)
    - [Attribute serialization (`attr:`)](#attribute-serialization-attr)
    - [Conditional attribute (`if:`)](#conditional-attribute-if)
    - [Ref directive (`use:ref`)](#ref-directive-useref)
    - [Style map (`style:map`)](#style-map-stylemap)
    - [Class map (`class:map`)](#class-map-classmap)
    - [Class list (`class:list`)](#class-list-classlist)
    - [Unsafe HTML (`$:html`)](#unsafe-html-html)
    - [Spread attributes](#spread-attributes)
  - [Component Model](#component-model)
    - [Function components](#function-components)
    - [Components with props](#components-with-props)
    - [Dotted component access](#dotted-component-access)
  - [Control Helpers](#control-helpers)
    - [For-each (`for:each` / `repeat`)](#for-each-foreach--repeat)
  - [Literal Flavor Directives](#literal-flavor-directives)
    - [Default (Lit)](#default-lit)
    - [Server-side rendering](#server-side-rendering)
    - [Signals](#signals)
  - [Auto-Imports](#auto-imports)
  - [Mix \& Match](#mix--match)
- [License](#license)

---

</div>

## Specs — JSX → HTML tagged template compiler

> [!NOTE]  
> This is **not** a JSX runtime. It compiles JSX statically to `html` tagged
> templates at build time.  
> Think Solid-style compilation, but targeting **Lit**, **µhtml**, or any
> compatible tagged template runtime.

All examples below show real transformer output (auto-generated imports
included).

---

### JSX Syntax

#### Basic elements

```tsx
// Input
const el = <div>Hello</div>;
```

```js
// Output
import { html } from 'lit';
const el = html`<div>Hello</div>`;
```

#### Fragments

```tsx
const el = <>Hello</>;
```

```js
import { html } from 'lit';
const el = html`Hello`;
```

#### Nested elements

```tsx
const el = (
  <div>
    <main>
      <span>Hi</span>
    </main>
  </div>
);
```

```js
import { html } from 'lit';
const el = html`<div>
  <main><span>Hi</span></main>
</div>`;
```

#### Void elements

XML-style self-closing tags are normalized to HTML-compliant void elements.

```tsx
const el = (
  <>
    <br />
    <hr />
    <img src="#" />
  </>
);
```

```js
import { html } from 'lit';
const el = html`<br />
  <hr />
  <img src="#" />`;
```

Non-void custom elements are properly closed:

```tsx
const el = <my-element></my-element>;
```

```js
import { html } from 'lit';
const el = html`<my-element></my-element>`;
```

#### Expression children

```tsx
const name = 'World';
const el = <span>{name}</span>;
```

```js
import { html } from 'lit';
const name = 'World';
const el = html`<span>${name}</span>`;
```

#### HTML comments

JSX empty expressions with HTML comment syntax are preserved as real HTML
comments.

```tsx
const el = <div>{/* <!-- My Comment --> */}</div>;
```

```js
import { html } from 'lit';
const el = html`<div><!-- My Comment --></div>`;
```

Regular JSX comments (`{/* ... */}`) without the `<!-- -->` markers are
stripped.

---

### Attributes & Bindings

#### Static attributes

```tsx
const el = (
  <div title="Hello" hidden>
    Hi
  </div>
);
```

```js
import { html } from 'lit';
const el = html`<div title="Hello" hidden>Hi</div>`;
```

#### Expression attributes

```tsx
const el = <div title={'Hello'}>Hi</div>;
```

```js
import { html } from 'lit';
const el = html`<div title=${'Hello'}>Hi</div>`;
```

#### Property binding (`_:`)

Maps to Lit's `.property` syntax.

```tsx
const el = <div _:className={'abc'}>Hi</div>;
```

```js
import { html } from 'lit';
const el = html`<div .className=${'abc'}>Hi</div>`;
```

#### Event binding (`on:`)

Maps to Lit's `@event` syntax.

```tsx
const el = <div on:click={handler}>Hi</div>;
```

```js
import { html } from 'lit';
const el = html`<div @click=${handler}>Hi</div>`;
```

#### Boolean binding (`bool:`)

Maps to Lit's `?attr` syntax, wrapping the value with `Boolean()`.

```tsx
const el = <div bool:disabled={true}>Hi</div>;
```

```js
import { html } from 'lit';
const el = html`<div ?disabled=${Boolean(true)}>Hi</div>`;
```

#### Attribute serialization (`attr:`)

Wraps the value with `JSON.stringify()` for SSR-friendly serialization.

```tsx
const el = <div attr:data={{ a: 1 }}>Hi</div>;
```

```js
import { html } from 'lit';
const el = html`<div data=${JSON.stringify({ a: 1 })}>Hi</div>`;
```

#### Conditional attribute (`if:`)

Wraps the value with `ifDefined()` — the attribute is omitted from the DOM when
the value is `undefined`.

```tsx
const el = <div if:href={url}>Hi</div>;
```

```js
import { html } from 'lit';
import { ifDefined as $_ifDefined } from 'lit/directives/if-defined.js';
const el = html`<div href=${$_ifDefined(url)}>Hi</div>`;
```

#### Ref directive (`use:ref`)

Injects a `ref()` directive call in-place (as an attribute-less binding).

```tsx
const el = <main use:ref={myRef}>Hi</main>;
```

```js
import { html } from 'lit';
import { ref as $_ref } from 'lit/directives/ref.js';
const el = html`<main ${/* use:ref */ $_ref(myRef)}>Hi</main>`;
```

#### Style map (`style:map`)

Wraps the value with `styleMap()` and renames to `style`.

```tsx
const el = <div style:map={{ color: 'red' }}>Hi</div>;
```

```js
import { html } from 'lit';
import { styleMap as $_styleMap } from 'lit/directives/style-map.js';
const el = html`<div style=${/* map */ $_styleMap({ color: 'red' })}>Hi</div>`;
```

#### Class map (`class:map`)

Wraps the value with `classMap()` and renames to `class`.

```tsx
const el = <div class:map={{ active: true }}>Hi</div>;
```

```js
import { html } from 'lit';
import { classMap as $_classMap } from 'lit/directives/class-map.js';
const el = html`<div class=${/* map */ $_classMap({ active: true })}>Hi</div>`;
```

#### Class list (`class:list`)

Wraps the value with `clsx()` and renames to `class`.

```tsx
const el = <div class:list={{ active: true }}>Hi</div>;
```

```js
import { html } from 'lit';
import { clsx as $_clsx } from 'clsx';
const el = html`<div class=${/* list */ $_clsx({ active: true })}>Hi</div>`;
```

#### Unsafe HTML (`$:html`)

Injects `unsafeHTML()` in the element body. The attribute value becomes the
argument.

```tsx
const el = <div $:html={'<b>Bold</b>'}>Fallback</div>;
```

```js
import { html } from 'lit';
import { unsafeHTML as $_unsafeHTML } from 'lit/directives/unsafe-html.js';
const el = html`<div>${$_unsafeHTML('<b>Bold</b>')}</div>`;
```

#### Spread attributes

Spread attributes are resolved at compile time using the type checker.
Individual properties are expanded into their corresponding bindings.

```tsx
const props = { id: 'main' };
const el = <div {...props}>Hi</div>;
```

```js
import { html } from 'lit';
const props = { id: 'main' };
const el = html`<div id=${props['id']}>Hi</div>`;
```

---

### Component Model

PascalCase JSX tags are compiled to **function calls** with a props object.
Children are passed via the `"$:children"` key as a nested tagged template.

#### Function components

```tsx
const MyComp = ({ children }) => <>{children}</>;
const el = <MyComp>Hello</MyComp>;
```

```js
import { html } from 'lit';
const MyComp = ({ children }) => html`${children}`;
const el = html`${MyComp({
  '$:children': html`Hello`,
})}`;
```

#### Components with props

```tsx
const MyComp = ({ title, children }) => <div title={title}>{children}</div>;
const el = <MyComp title={'yo'}>Hi</MyComp>;
```

```js
import { html } from 'lit';
const MyComp = ({ title, children }) =>
  html`<div title=${title}>${children}</div>`;
const el = html`${MyComp({
  '$:children': html`Hi`,
})}`;
```

#### Dotted component access

```tsx
const ns = { Comp: ({ children }) => <main>{children}</main> };
const el = <ns.Comp>Hi</ns.Comp>;
```

```js
import { html } from 'lit';
const ns = { Comp: ({ children }) => html`<main>${children}</main>` };
const el = html`${ns.Comp({
  '$:children': html`Hi`,
})}`;
```

---

### Control Helpers

#### For-each (`for:each` / `repeat`)

The `<for:each>` element inside a `.map()` call is compiled to Lit's `repeat()`
directive. The `key` attribute provides the identity function; children become
the template function.

```tsx
const el = (
  <ul>
    {['a', 'b'].map((id) => (
      <for:each key={id}>
        <li>{id}</li>
      </for:each>
    ))}
  </ul>
);
```

```js
import { html } from 'lit';
import { repeat as $_repeat } from 'lit/directives/repeat.js';
const el = html`<ul>
  ${$_repeat(
    ['a', 'b'],
    (id) => id,
    (id) => html`<li>${id}</li>`,
  )}
</ul>`;
```

---

### Literal Flavor Directives

A `"use html-*"` directive at the top of a file controls which `html` tag
function is imported.

#### Default (Lit)

```tsx
const el = <div>Hello</div>;
```

```js
import { html } from 'lit';
const el = html`<div>Hello</div>`;
```

#### Server-side rendering

```tsx
'use html-server';
const el = <div>Hello</div>;
```

```js
import { html } from '@lit-labs/ssr';
/** @use html-server */ const el = html`<div>Hello</div>`;
```

#### Signals

```tsx
'use html-signal';
const el = <div>Hello</div>;
```

```js
import { html } from '@lit-labs/signals';
/** @use html-signal */ const el = html`<div>Hello</div>`;
```

---

### Auto-Imports

All runtime imports are **injected automatically** based on usage — you never
import directives manually. The `$_` prefix (configurable via
`antiCollisionImportPrefix` in the preset) prevents naming collisions with user
code.

| Feature used | Auto-imported                                     |
| ------------ | ------------------------------------------------- |
| Any JSX      | `html` from `lit` (or flavor variant)             |
| `if:`        | `ifDefined` from `lit/directives/if-defined.js`   |
| `use:ref`    | `ref` from `lit/directives/ref.js`                |
| `style:map`  | `styleMap` from `lit/directives/style-map.js`     |
| `class:map`  | `classMap` from `lit/directives/class-map.js`     |
| `class:list` | `clsx` from `clsx`                                |
| `$:html`     | `unsafeHTML` from `lit/directives/unsafe-html.js` |
| `$:svg`      | `unsafeSVG` from `lit/directives/unsafe-svg.js`   |
| `<for:each>` | `repeat` from `lit/directives/repeat.js`          |

---

### Mix & Match

JSX and tagged template literals are fully interoperable. You can embed `html`
literals inside JSX and JSX inside `html` literals.

```tsx
// Tagged template inside JSX
const el = <main>{html`<span>Inner</span>`}</main>;
```

```js
import { html } from 'lit';
const el = html`<main>${html`<span>Inner</span>`}</main>`;
```

<div class="git-only">

---

## License

ISC — Julian Cataldo

</div>
