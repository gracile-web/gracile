# @gracile-labs/functional

Lightweight hooks and context primitives for signal-based render trees.  
Works anywhere a render function can be scoped, with Lit or similar templating
libraries.  
Uses the TC39 Signal Proposal for its backend.

> [!CAUTION]  
> NOT FOR PRODUCTION!  
> It's an experiment to see how far we can go.

## 🧠 Why

Web development is increasingly polarized around two powerful patterns:

- **Immutable, top-down render trees**
- **Reactive primitives** (known as "Signals"), which enable fine-grained
  updates

It's a simplification. In practice, there is overlap, and not all systems were
designed with Signals as their foundation. Also, both approachs are valid and
boils down to developer preference, context, and technical limitations.

Templating libraries like `lit-html` historically gives you efficient top-down
rendering via tagged template literals, while signal-based systems give you
surgical reactivity.  
In the original `lit`/`lit-html` model, Custom HTML Element acts as "relays",
where you can stuff all the reactive primitives, methods, and any intricate
stuff you need to build an app. `lit-html` templates are "stateless",
deterministic (theoretically).  
That's was a feature, not a limitation.

However, a recent breakthrough was the integration of the TC39 Signal Proposal
in a Lit friendly `@lit-labs/signals` package, which unlock an hybrid solution.
You can still use the familiar, and easy to mindmap vertical data stream, but
also avoid endless prop. drilling when needed, thanks to Signal aware template
expressions.

That being said, you'll soon be tempted to do something `LitElement` was
invented for, which is adding **self-contained state** to pieces of reusable
unit ("Web Component" / "Custom Element" / "React FC"…):

```ts
const count = signal(0); // <-- Outside of the render tree. You're fine :)

function Counter() {
  const count = signal(0); // <-- Inside the render tree. Oh no :(

  return html`
    <button @click=${count.set(count.get() + 1)}>Clicked ${count} times</button>
  `;
}

html`<div>${Counter()}</div>`;
```

**You don't want to do that**. The official way to create a Signal is _outside_
of a the render tree, otherwise it will be recreated on each `render` call. It's
not like Solid-js, which was designed **solely** with signal primitives and JSX
pre-compilation in mind.

> Also, at the time of writing, official examples are featuring `LitElement` as
> a "Signal Host" thanks to a `SignalWatcher` Mixin.  
> While you can use the good old `render` function for Light DOM with a
> `SignalHost` and pure `lit-html` (no required Custom Element host), it's less
> straightforward than relying on the `@lit-labs` package, off-the-shelf Mixin.
> Moreover, you might encounter bugs with stratified SSR scenarios. It's still
> an experimental package after all, and the Lit team is collecting feedback.

So what do we need to author those self-contained "Component", _à-la_ React,
Preact, Vue-Vine… you name it?

This is where `@gracile-labs/functional` is coming into play.  
This library is providing the ergonomics of `useState`, `createEffect`, and
`useContext` without locking you into a full framework. It's mostly a facade for
the Signal polyfill and the Lit Signals helpers (mixin, html tag…), or any
custom, signal-aware templating implementation.

It works with:

- Custom JSX runtimes (e.g. JSX + tagged templates)
- Template literal systems like `lit-html`.
- Returned in Lit’s `render()` method (shadow DOM or light DOM)
- Anything else that follows the `render(host, fn)`, top-down model

All that by avoiding heavy or redundant machinery. It just collect and offload
the reactivity work the the Signals scheduler, in a colocated fashion.

The API is purposefully kept as minimal as possible.

## 🧪 How it works

`@gracile-labs/functional` scopes state and side-effects to the current **render
host** — any object passed to `withFunctional(host, renderFn)`. This lets you:

- Reuse `useState()` and `useContext()` safely across renders
- Scope reactive effects to a host's lifecycle
- Test hook logic without needing DOM APIs or `HTMLElement` interfaces
- Compose functional components with consistent reactivity

## 🚀 Quickstart (w. LitElement + Lit Signals)

```tsx
import { WithFunctional, useState } from '@gracile-labs/functional';
import { SignalWatcher } from '@lit-labs/signals';
import { html, LitElement } from 'lit';

@customElement('counter-button')
export class CounterButton extends WithFunctional(SignalWatcher(LitElement)) {
  render() {
    const [count, setCount] = useState(0);

    return html`
      <button @click=${() => setCount(count.get() + 1)}>Count: ${count}</button>
    `;
  }
}
```

---

## 🧱 API

### `withFunctional(host, () => TemplateResult)`

Establishes a render scope where `useState`, `createEffect`, and
`provideContext` work.

### `WithFunctional(BaseClass)`

Mixin for Lit-style components — auto-wraps `render()` with
`withFunctional(this, ...)`.

### `useState(initial: T): [Signal.State<T>, (value: T) => void]`

Reactive local state. Value is a `Signal.State<T>`, compatible with Lit’s
reactivity system.

### `createMemo(fn: () => T): Signal.Computed<T>`

Signal-aware memoization — returns a computed signal. Recomputes when tracked
signals change.

### `createEffect(fn: () => void | () => void)`

Runs after render. Cleanup is run on re-render or unmount. Equivalent of
`useEffect()`.

### `onMount(fn)`, `onCleanup(fn)`

Shorthands for post-render effect logic.

### `createContextProvider<T>(defaultValue: T): [Provider, useContext]`

Creates a scoped context system.

---

## 🧩 Advanced Use (Light DOM)

```tsx
<FunctionalComponents>
  {() => (
    <ThemeProvider>
      <Child />
    </ThemeProvider>
  )}
</FunctionalComponents>
```

**Light DOM reactivity in production builds is experimental** due to current
limitations in `@lit-labs/signals`:

- `watch()` directives may fail when code is minified (private names)
- Custom `SignalHost` objects may not be recognized in production

**Use CE + Shadow DOM for now** as a safe baseline.

## 🧪 Testing Hooks

You can test everything without Lit, DOM, or browser:

```ts
const host = {};
const result = withFunctional(host, () => {
  const [count, setCount] = useState(1);

  setCount(2);

  return count.get();
});
```

<!-- ## 🔍 Reactivity Model Comparison -->

<!-- | Framework | Reactive Core          | Rendering Approach          | Notes                                 |
| --------- | ---------------------- | --------------------------- | ------------------------------------- |
| React     | VDOM + hooks           | Full VDOM diffing           | Third parties experimental signals        |
| Vue 3     | Signals (`ref`) + VDOM | VDOM + fine-grained patches | Hybrid; dependency tracking optimized |
| SolidJS   | Signals only           | Compile-time template       | No VDOM; ultra-fine-grained           |
| Angular   | Signals (v17+)         | Zone-less + signal views    | Emerging hybrid; no zones required    |
| Svelte    | Compiler reactivity    | DOM mutations at compile    | Reactive declarations, not signals    |
| Lit       | Manual `Signal` + DOM  | Tagged template literal     | Surgical reactivity via signals       | -->

## 📦 Install

```bash
pnpm add @gracile-labs/functional
```

---

## In-depth

The hook set API philosophy aligns with React's `use*`, but it could have been
Solid's `create*`.

<!-- Gracile Functional is:

- Host-bound (like React)
- Sync-only (like Solid)
- Render-tracked (like React)
- Non-dependency-tracked effects (like Solid) -->

It looks like React but behave closer to Solid in places.

…

## 🙏 Acknowledgements

- [TC39 Signals](https://github.com/tc39/proposal-signals)
- [@lit-labs/signals](https://github.com/lit/lit/tree/main/packages/labs/signals)

## 👀 Other Projects

- [Web Elements Analyzer](https://github.com/JulianCataldo/web-elements-analyzer)
  — A cross-framework template analyzer, for deep insights on standard HTML, SVG
  and Custom Elements.
- [Gracile](https://github.com/gracile-web/gracile) — A thin, full-stack, web
  framework, with standards in mind.
- [JSON Schema Form Element](https://github.com/json-schema-form-element/jsfe) —
  A Custom Element that auto-generates forms, declaratively.
