# JSX to HTML literals (Babel transformer)<!-- omit in toc -->

A JSX to `html` template literals Babel plugin.

`@gracile-labs/babel-plugin-jsx-to-literals` is a well-tested, low level library
than you can borrow for your custom build pipeline.

![](https://ik.imagekit.io/juliancataldo/gracile/jsx2literals/screenshot-1.png?updatedAt=1762961307030)

<div class="git-only">

---

- [🧪 Specs — JSX → HTML tagged template compiler](#-specs--jsx--html-tagged-template-compiler)
  - [✅ JSX Syntax Support](#-jsx-syntax-support)
  - [🧱 Attribute \& Prop Binding](#-attribute--prop-binding)
  - [🧩 Component Model](#-component-model)
  - [🔁 Control Helpers](#-control-helpers)
  - [⚙️ Directives (`html` flavors)](#️-directives-html-flavors)
  - [⚔️ Deviations \& Design Principles](#️-deviations--design-principles)
  - [🔀 Output Format](#-output-format)
- [🔒 Type Safety \& TS Integration](#-type-safety--ts-integration)
  - [✅ Native DOM + Namespaced Attributes](#-native-dom--namespaced-attributes)
  - [🛠 Enable in `tsconfig.json`](#-enable-in-tsconfigjson)
  - [🧩 Adding Custom Elements](#-adding-custom-elements)
- [🤔 Why](#-why)
- [🫡 Going further](#-going-further)
  - [Meta-JSX](#meta-jsx)
  - [Compiler optimizations](#compiler-optimizations)
  - [DX comparison between JSX and tagged templates](#dx-comparison-between-jsx-and-tagged-templates)
    - [Where tagged templates shine](#where-tagged-templates-shine)
    - [Where JSX shines](#where-jsx-shines)
    - [Conclusion](#conclusion)
- [🧭 Looking Toward Web Platform Standardization](#-looking-toward-web-platform-standardization)

---

</div>

## 🧪 Specs — JSX → HTML tagged template compiler

> [!NOTE]  
> This is **not** a JSX runtime. It compiles JSX statically to
> <code>html\`...\`</code> tagged templates.  
> Think of it as "JSX as syntax only", a bit like Solid, but targeting **Lit**,
> **µhtml** or any compatible runtime implementation, even your own.

> It follows **native HTML semantics** and **Lit's binding/helpers
> conventions**.  
> It does not invent abstractions but translate them.  
> It's possible to remap helpers with your own import paths if you're not using
> Lit.

This project started as a convenience transformer for personal needs, starting
from mid-2024.  
I added parity and DX perks with Lit while building the Gracile framework
website entirely with JSX. It's pretty opinionated and arguably rigid.  
This transformer comes with a sample JSX namespace and a few helper components
to bootstrap quickly and adapt later (forking is encouraged).

It became a live spec/implementation over time, while proofing all these ideas.
However, **I'm working on a successor** for this project, which is already much
more powerful, comes with a bunch of little optimizations and things that are
impossible to achieve with Babel. All that with a reduced footprint. But before,
I had to release this first stepstone before ramping up. Even for pure archiving
reason.  
_Stay tuned_.

---

### ✅ JSX Syntax Support

| Feature                     | Status | Example                                                                                               |
| --------------------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| Basic elements              | ✅     | <code>&lt;div&gt;Hello&lt;/div&gt;</code> → <code>html\`&lt;div&gt;Hello&lt;/div&gt;\`</code>         |
| Fragments                   | ✅     | <code>&lt;&gt;Hi&lt;/&gt;</code> → <code>html\`Hi\`</code>                                            |
| Expressions                 | ✅     | <code>&lt;span&gt;{name}&lt;/span&gt;</code> → <code>html\`&lt;span&gt;\${name}&lt;/span&gt;\`</code> |
| Component call              | ✅     | <code>&lt;Comp foo="bar" /&gt;</code> → <code>\${Comp({ foo: "bar" })}</code>                         |
| Component children          | ✅     | <code>&lt;Comp&gt;Hi&lt;/Comp&gt;</code> → <code>\${Comp({ children: html\`Hi\` })}</code>            |
| Comments                    | ✅     | <code>// line /\* block \*/</code> → stripped                                                         |
| Escaped text                | ✅     | <code>&lt;div&gt;\`Hi\`&lt;/div&gt;</code>                                                            |
| XML-like voids              | ✅     | <code>&lt;br /&gt;</code> → <code>&lt;br&gt;</code>                                                   |
| Auto-closing                | ✅     | <code>&lt;my-el /&gt;</code> → <code>&lt;my-el&gt;&lt;/my-el&gt;</code>                               |
| JSX inside tagged templates | ✅     | <code>html\`&lt;main&gt;\${&lt;Comp /&gt;}&lt;/main&gt;\`</code>                                      |
| Tagged templates inside JSX | ✅     | <code>&lt;Comp&gt;{html\`&lt;main&gt;&lt;/main&gt;\`}&lt;/Comp&gt;</code>                             |

---

### 🧱 Attribute & Prop Binding

| Syntax                                      | Output                                          | Notes                     |
| ------------------------------------------- | ----------------------------------------------- | ------------------------- |
| <code>title="Hi"</code>                     | <code>title="Hi"</code>                         | Static                    |
| <code>title={"Hi"}</code>                   | <code>title=\${"Hi"}</code>                     | Interpolated              |
| <code>prop:checked={x}</code>               | <code>.checked=\${x}</code>                     | Lit-style property        |
| <code>bool:required={x}</code>              | <code>?required=\${x}</code>                    | Lit-style boolean         |
| <code>on:click={fn}</code>                  | <code>@click=\${fn}</code>                      | DOM event                 |
| <code>on:change={fn}</code>                 | <code>@change=\${fn}</code>                     | Custom event              |
| <code>class:map={{...}}</code>              | <code>class=\${classMap(...)}</code>            | Needs `classMap`          |
| <code>class:list={[...]}</code>             | <code>class=\${clsx(...)}</code>                | Needs `clsx`              |
| <code>style:map={{...}}</code>              | <code>style=\${styleMap(...)}</code>            | Needs `styleMap`          |
| <code>ref={fnOrRef}</code>                  | <code>\${ref(fnOrRef)}</code>                   | Directives                |
| <code>attr:data={obj}</code>                | <code>data=\${JSON.stringify(obj)}</code>       | Attr. serialization (SSR) |
| <code>if:foo={x}</code>                     | <code>foo=\${ifDefined(x)}</code>               | Lit directive             |
| <code>\<i unsafe:html=${'\<br>'} /\></code> | <code>\<i\>${unsafeHTML('\<br\>')}\</i\></code> | Lit directive             |

---

### 🧩 Component Model

| Feature               | Status | Example                                                                          |
| --------------------- | ------ | -------------------------------------------------------------------------------- |
| Function components   | ✅     | <code>const A = () =&gt; &lt;div /&gt;; &lt;A /&gt;</code>                       |
| Children as slots     | ✅     | <code>&lt;A&gt;Hello&lt;/A&gt;</code> or <code>children: () =&gt; "Hello"</code> |
| Namespaced components | ✅     | <code>&lt;ns.Comp /&gt;</code>                                                   |
| Attribute namespaces  | ✅     | <code>prop:</code>, <code>on:</code>, <code>class:</code>, etc.                  |
| JSX in html           | ✅     | <code>html\`&lt;div&gt;\${&lt;X /&gt;}&lt;/div&gt;\`</code>                      |
| html in JSX           | ✅     | <code>&lt;Comp&gt;{html\`&lt;p /&gt;\`}&lt;/Comp&gt;</code>                      |

---

### 🔁 Control Helpers

It's mostly sugar, inspired by Solid, that wraps Lit helpers nicely.

| Helper                                                         | Status | Notes                                               |
| -------------------------------------------------------------- | ------ | --------------------------------------------------- |
| <code>&lt;For each={arr} key={({ id }) => id} ... /&gt;</code> | ✅     | Uses <code>repeat</code> under the hood (Lit idiom) |
| <code>&lt;Show when={x}&gt;...&lt;/Show&gt;</code>             | ✅     | Uses <code>when</code> directive internally         |

### ⚙️ Directives (`html` flavors)

| Input                          | Effect                                              |
| ------------------------------ | --------------------------------------------------- |
| <code>"use html-server"</code> | Uses <code>@lit-labs/ssr</code>                     |
| <code>"use html-signal"</code> | Uses <code>@lit-labs/signals</code>                 |
| (no directive)                 | Defaults to <code>import { html } from "lit"</code> |

🧩 The directive (e.g. <code>"use html-signal"</code>) tells the plugin which
flavor of Lit’s <code>html</code> to import: regular, SSR, or Signals.  
✅ All runtime imports (e.g. <code>html</code>, <code>ref</code>,
<code>classMap</code>) are auto-injected only if used, and can be hot-swapped
with user-defined imports via plugin options; giving full control.

---

### ⚔️ Deviations & Design Principles

| Design                                                | Supported | Notes                                           |
| ----------------------------------------------------- | --------- | ----------------------------------------------- |
| Component namespaces (<code>&lt;Foo.Bar /&gt;</code>) | ✅        | Like React                                      |
| Attribute namespaces (<code>prop:</code>, etc.)       | ✅        | Like Solid, not React                           |
| Custom serialization (e.g. <code>attr:data</code>)    | ✅        | Declarative extension                           |
| Spread props                                          | ❌        | Not supported                                   |
| JSX runtime                                           | ❌        | None. Syntax-only (compile step only)           |
| VDOM / reactivity                                     | ❌        | No VDOM. Relies on user brought reactive system |
| HTML-first                                            | ✅        | All syntax is spec-aligned and unopinionated    |

---

### 🔀 Output Format

All JSX compiles to hydrated Lit templates with part markers:

```html
<!--lit-part ...-->
<div>Hello</div>
<!--/lit-part-->
```

---

- SSR and client output match
- Hydration-safe
- No runtime wrappers
- DOM tree matches what you'd write by hand

---

🔍 Real-world Example JSX:

```tsx
<input
  class="toggle"
  type="checkbox"
  prop:checked={todo.completed}
  on:input={(e) => store.toggle(todo.id, e.currentTarget.checked)}
/>
```

Output:

```ts
html`<input
  class="toggle"
  type="checkbox"
  .checked=${todo.completed}
  @input=${(e) => store.toggle(todo.id, e.currentTarget.checked)}
/>`;
```

## 🔒 Type Safety & TS Integration

`babel-plugin-jsx-to-literals` provides **first-class type safety** for DOM
elements, namespaced attributes, and custom elements, without any JSX runtime.

While it's a low-level transformer, these satellite files are here to kickstart
your own pipeline, and are meant to be adapted to your needs, given it's **JSX
typings and runtime helpers are out-of-scope** for this project.

---

### ✅ Native DOM + Namespaced Attributes

Attributes are **prefixed** using JSX namespaced names (e.g. `prop:*`, `on:*`,
`if:*`), and tied to the correct DOM element type via `HTMLElementTagNameMap`.

You get full IntelliSense for:

- `<input prop:checked={true} />`
- `<div if:visible={condition} />`
- `<my-el on:custom={() => ...} />`

This ensures proper typing for:

- Event handlers
- Boolean vs string attributes
- Refs (e.g. `ref={(el: HTMLInputElement) => ...}`)

---

### 🛠 Enable in `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@gracile-labs/babel-plugin-jsx-to-literals",
  },
}
```

> This tells TypeScript to use `babel-plugin-jsx-to-literals` sample JSX typings
> (based on the DOM spec, extended for namespace handling).

---

### 🧩 Adding Custom Elements

To type custom elements, declare an ambient module:

```ts
// ambient.d.ts
import type { CustomElements } from './jsx.js';

declare global {
  namespace JSX {
    interface IntrinsicElements extends CustomElements {}
  }
}
```

Then map each tag:

```ts
// jsx.js
export type CustomElements = {
  'my-el': JSX.HTMLAttributes<MyElementPropsAndAttrs>;
};
```

This gives you:

- Autocompletion for custom tag names
- Namespaced attribute support (`prop:`, `on:`)
- Correct DOM types for `ref` and event bindings

---

> 🧠 Behind the scenes, the JSX namespace maps each tag to its correct DOM type
> via `HTMLElementTagNameMap` and prefixes all props with allowed namespaces,
> like Solid, but more aligned with HTML spec.

## 🤔 Why

During early research, I found that besides Stencil JS (a closed system) and a
few abandoned projects, there wasn’t much in terms of agnostic JSX
implementations that could work with any Custom Element or plain functional
templates (à la React).  
Solid made me realize that using JSX doesn’t force you to follow React’s traits,
all the way down to the runtime.  
Then I discovered Andrea Giammarchi’s article,
[Bringing JSX to Template Literals](https://webreflection.medium.com/bringing-jsx-to-template-literals-1fdfd0901540).  
At
that point, I had no practical experience with Babel plugins or JSX runtimes. I
just knew from theory (blogs…) and build output analysis that it all goes
through a factory function (the famous “h”), and in the end, whether you use
Vue, React, Preact, or Solid, you end up with deeply nested function calls, each
node representing a component or intrinsic HTML element.

My first attempt was to adapt his work,
[jsx2tag](https://github.com/WebReflection/jsx2tag), to allow injection of
useful directives (styleMap, ref…).

But I hit a first obstacle: **Trusted Types**.

jsx2tag generates React-like classic JSX output with a factory function, a
"pragma"… Then, at runtime, the deeply nested function calls (one for each
element) are reassembled, and a template function signature literal is faked
(pardon me if I’ve forgotten some nuances, it’s been a while).  
This approach has limits:

- Function calls have a runtime cost: one that Lit and other literal-based
  template systems aim to avoid.
- The built output is verbose and less human-readable (more machine-oriented
  than HTML-like).
- Faking template literals raises Trusted Types errors with Lit. You can shim
  this by
  [circumventing Lit’s Trusted Type polyfill check step](https://github.com/lit/lit/blob/a126d8dfb05df0bbf30d771685b9c8034d7be542/packages/lit-html/src/lit-html.ts#L748).

But the real blocker for me was the sheer number of unnecessary function
calls.  
There is another plugin (by the same author) to “static-ify” those calls, but
that wasn’t a path I wanted to pursue.

> Note that JavaScript had some interesting proposals that could alleviate this
> problem: performance optimizations for partially static object.

Still, it already felt too far removed from Lit’s core simplicity (which is
designed to disappear and let the platform work).

Eventually, after grinding my teeth on that PoC, I gained practical knowledge of
Babel and learned how to debug its AST...

That’s when I built the first version of **a "jsx2lit-like"** transformer, but
this time with a different approach: convert JSX... literally.  
I didn’t want a DSL-specific runtime, so I asked: _what if we use tagged
templates as build output, not as authoring format_?  
Tagged templates are already performant, concise, minifiable, easier to debug.
They _might_ become a Web Standard one day.  
Also, JSX and HTML literals should be interoperable. In short: stay very close
to how you’d write HTML by hand.

The first version was very hacky.  
I took inspiration from asyncLiz’s
[minify-html-literals](https://github.com/asyncLiz/minify-html-literals), which
uses `@placeholders` for interpolations. It performs a first pass to separate
static and dynamic parts, then reassembles them after processing.  
I followed a similar idea, but quickly realized that manipulating JS outside of
Babel’s AST visitor logic was a mess; it breaks source maps and confuses the
Babel pipeline.  
I didn’t want to fall into the same category as Svelte/Astro/Vue templates with
MagicStrings and manual source maps reimplementation.

Instead, JSX provides a clean, standardized AST.  
The build output is also TS, so we can map things 1:1.

There was also the perspective to preserve (much) of user formatting, even more
after I discovered [recast](https://github.com/benjamn/recast), a tool made for
this endeavor.

After much fiddling and learning with Babel, I found my way for processing JSX
with **pure AST transforms**. No hacks, no string-patching, accurate source
maps, predictable behavior.

From there, I started exploring DX improvements:

- Type safety
- Directives
- Configurable auto-imports
- Global JSX typing for custom elements

Essentially, a full abstraction layer that respects Lit conventions **_but_**
lets you bring your own tools.

For example, `class:list={...}` → `class=${clsx(...)}` is configurable (you can
swap `clsx` with `cn` or whatever you prefer). Same for the `html` tag function.

One of the latest additions was the `"use html-*"` directive, allowing you to
switch between Lit’s three `html` flavors (regular, SSR, signals).

---

Following Lit’s template philosophy, `babel-plugin-jsx-to-literals` is more
explicit than typical JSX, and this can be a good thing.  
You’re not relying on opaque framework heuristics.

Think of this transformer as some sort of XHTML-in-JS: stricter than HTML, but
free from React-style constraints like `className` and `htmlFor`, all artifacts
of JavaScript semantics. These constraints often feel awkward in templates. They
can confuse users when they see, in devtools, that props and attributes are
handled "magically" by React.

For example, did you know that React renames some native DOM events?
`<input onFocusOut>` becomes `onBlur`, diverging from standard behavior.  
Similarly, with React, events are wrapped, and delegated in `SyntheticEvent`s.
Or you wil encounter the concept of "controlled/uncontrolled" forms
(`defaultValue` versus `value` with `onChange`)…  
and we could go on.

React will also complain loudly if you diverge from its opinionated ways.

From a technical perspective, these choices are understandable: they reflect
React’s tightly coupled rendering model. It’s also a philosophical stance: React
aims to smooth over inconsistencies between JavaScript and the DOM. This works
well in cross-platform contexts like React Native. But on the web, it introduces
significant opacity around how HTML and the browser actually work.

---

## 🫡 Going further

### Meta-JSX

This package can be seen as a **Meta-JSX dialect** PoC. A strict subset with
conventions aligned to web platform specs (with sprinkled Lit's idioms, as a
canary).  
This concept could fuel the idea of an **intermediary JSX format**, compatible
across libraries.

In fact, I have some experiment currently tested with
[JSFE](https://github.com/json-schema-form-element/jsfe).  
The goal is to offer a transformer that takes a Meta JSX format and compiles it
into runtime-compatible JSX (React, Vue, Preact, Solid…), to be processed by
each ecosystem’s toolchain (via official Vite plugins, etc.).

This layer is purely static (no runtime) and ensures that vocabularies (props,
attrs, events, etc.) are correctly mapped with their quirks.

Surprisingly, this separate PoC already works well, and bridging the gaps wasn’t
_that_ hard.  
If you follow a pure top-down data flow model (via props), it’s straightforward
to build generic JSX components that work across runtimes.

If TC39’s **Signal** proposal lands and is widely implemented, we’ll have the
last piece of the puzzle: a truly runtime-agnostic JSX authoring format +
reactivity system backbone.

Note that, for now, this PoC evolves as a separate project.

### Compiler optimizations

Using literals as an output we can benefit from
[the official Lit compiler](https://github.com/lit/lit/tree/main/packages/labs/compiler)
that comes as a TypeScript transform plugin.

You also already benefit from the JSX parser that already **collapses
whitespace** for us and applies **very light** space compression, preserving
authoring intent when tasteful.  
That also prevent typical foot-guns with whitespace aware HTML tags (textarea,
pre…), especially in combination with Prettier auto-formatting that can
introduce unwanted bugs with literals. They are literally _literal_, remember,
_as-is_, nothing will save you from yourself after you hit `Ctrl+S`.

> [!TIP]  
> Comments are removed, which greatly reduces the need for a minifier (as long
> as you’re not embedding lots of inline CSS/scripts, etc.).

Syntax errors are caught early: TS compilation will fail outright, whereas the
Lit Plugin (backed by Lit Analyzer) only works in the IDE.  
Unfortunately, it can’t go as deep as the TypeScript compiler and its JSX
parser, by design.

One other use case that could be explored but requires significant effort is
**properties spreading** auto-mapping, at **compile time** (versus current
runtime based solutions for Lit). It would require firing up a TypeScript
compiler to introspect the types, or harder, rewriting the whole Babel plugin as
a TS transform plugin (less commonly supported and understood in the wild).

### DX comparison between JSX and tagged templates

As mentioned earlier, JSX brings several advantages, including better TypeScript
support, making the dev loop tighter and less error-prone.

Also, having used both systems extensively, I can assert having ~25%+ faster
editing speed with JSX.

#### Where tagged templates shine

**They’re ultra flexible.**

For low-level code (in cores, vendor libraries…), where you don’t want a
toolchain, they offer maximum robustness and predictability.  
_On contrary_, when working with high frequency changes app code, you want a
more comfortable authoring format, with guard rails, for easier refactoring. JSX
fits the bill here.

**They’re interoperable.**

You can copy-paste from CodePen, live-edit the build output for debugging,
live-code from an LLM assistance…

It’s _orders of magnitude_ easier to debug when your authoring format matches
your runtime. The easy win for literals here.

**They’re well supported in modern tooling.**

Editor support is solid: Zed (built-in), JetBrains, VS Code (via plugins).  
Lit Analyzer, TS plugins. All work quite reasonably.

But if you want **thorough strictness**, static string templates aren’t the best
foundation.

For example, the most complete TS + HTML Literals yet, Rune Mehlsen's Lit
Analyzer, adds an extra HTML parser on top of the TS AST.  
JSX sticks with a single, monolithic AST.  
Also, TS JSX lives in one language server, no necessary bridging (unlike Svelte
or Astro).

> [!Note]  
> Embedding HTML/CSS LSPs does offer some advantages over TS-only. Generally
> better docs or medium-tied editing features. Think Vue language tools and
> other Volar-based solutions.

**Styling.**

React’s CSS-in-JS world already experienced heavily tagged templates for CSS.

JSX doesn’t support CSS syntax highlighting or formatting inside `<style>` tags,
but tagged templates do.  
And you even get LSP support for “CSS inside HTML inside JS template literals”
(yep).

That said, you can still use `css` or `html` tagged templates inside JSX when
needed. Best of both worlds.

#### Where JSX shines

**Commenting in/out.**

Daily, that’s huge.

With tagged templates, commenting out code is a mess.  
You’ll run into composite file limitations, malformed interpolations, and the
**impossibility** of empty expressions like `${/* BOOM */}` vs
`{/* fine :) */}`.

**Formatting.**

JSX formatting is generally cleaner with Prettier.  
With `html` literals, you’ll hit quirks: orphaned opening tags, auto-closing
`<br>`, etc.  
It’s 90% there, but the friction builds up. Prettier has to satisfies HTML
whitespace pitfalls, which makes its work harder.

Note that Prettier’s JSX formatting isn’t _totally_ perfect either.

**Type safety.**

Even with advanced devtools, tagged templates won't allow inferring event types
for `@event` callbacks, or any other expressions. They are _not_ context aware
in the eyes of TypeScript.  
You’ll have to annotate function parameters manually.  
It’s a weak link: it's tough for TS/Lit Analyzer to infer intent from static
strings.  
Also, refactoring and other advanced language features are not supported with
the current devtools landscape for HTML literals.  
You cannot just rename symbols like that and expect the changes to propagate in
the whole codebase.  
That means go back to the good old `Cmd+Shift+F`. No fun.

But this could change over time, hopefully.

Still,once you get your hand on a well-typed JSX project, going back to pure
literals feels like a downgrade. Not painful, but less safe, less expressive.

**Visuals**

JSX is easier on the eye. No `$` or `html` prefixes everywhere, more concise
comments and functions can just become `<Components />`, versus
`${Component({ children: … })}`, with default children slot.  
Makes composition much more obvious, especially when we know that many Lit users
are using functional, stateless templates everywhere.

#### Conclusion

This comparison isn’t meant to convince you to abandon the **build-less** ethos
(which is niche in practice) by adding yet another layer of syntax.  
Some readers may be allergic to React idioms and seek a more platform-aligned
ecosystem.  
But even Lit is experimenting with compilers, as React and Svelte did before.

That’s because **DX benefits from pre-runtime enhancements**, and today’s
missing standards force us to reinvent templating in userland.

JS and template strings alone can’t capture the full richness of modern UI
abstraction.  
The bar has been raised.

These trends don’t diminish the power of tagged templates (for CSS, SQL,
GraphQL, etc.).  
This transformer simply aims to **reconcile both worlds**, which is bringing
JSX’s expressiveness to a literal-based foundation. Their signature **and**
their physical representation.

## 🧭 Looking Toward Web Platform Standardization

The `html` tagged template literal syntax, popularized by libraries like Lit,
htm, hyperHTML, might become a **native feature of the web platform**.

There are ongoing discussions and proposals such as
[`HTMLElement.html`](https://github.com/WICG/webcomponents/issues/882) and
[DOM Parts / Template Expressions](https://github.com/whatwg/dom/issues/948),
which explore ways to make **declarative, dynamic HTML** templating a standard,
with no need for virtual DOMs or custom compilation steps.

**`babel-plugin-jsx-to-literals`** was designed with this forecast in mind. It
compiles JSX into plain, standard `html` literals that align closely with how
native templating could work, preparing the ground for a **runtime-less,
natively composable UI model**.

This also resonates with work by **Andrea Giammarchi**, who proposed an `esx`
syntax and runtime that brings template expressions closer to JavaScript’s core.
His vision outlines a **web-native DSL** for templates, which, if standardized,
could eventually **eliminate the need for Babel plugins like this one**, though
that reality is still years away and subject to consensus.

Until then, userland solutions like `babel-plugin-jsx-to-literals` are providing
**practical bridges between today’s JSX ergonomics and tomorrow’s native web
rendering**.

---

I’ve used this plugin in a handful of production projects before open-sourcing
it, with plenty of tests and docs.  
As I'm working on its successor, feel free to fork it if you want to make it
more tailored to your needs.

<div class="git-only">

---

© 2024 — Julian Cataldo (contact@juliancataldo.com) — License ISC

</div>
