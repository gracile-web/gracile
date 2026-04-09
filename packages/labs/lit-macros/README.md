# <span class=git-only>Gracile — </span>Lit Macros (Vite plugin)

Compile-time transform for Lit decorators → static class idioms. Zero runtime.
OXC-powered.

> [!TIP]  
> You can use this plugin with any Vite+Lit setup! It's totally decoupled from
> the Gracile framework.

## What it does

You write standard Lit decorators. The plugin compiles them away before they
reach the browser:

```ts
// Input — your source code
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('my-greeting')
class MyGreeting extends LitElement {
  @property({ type: String }) name = 'World';
  @state() _count = 0;

  render() {
    return html`<p>Hello, ${this.name}! (${this._count})</p>`;
  }
}
```

```js
// Output — what reaches the browser / build
import { LitElement, html } from 'lit';

class MyGreeting extends LitElement {
  static properties = {
    name: { type: String },
    _count: { state: true },
  };

  constructor() {
    super();
    this.name = 'World';
    this._count = 0;
  }

  render() {
    return html`<p>Hello, ${this.name}! (${this._count})</p>`;
  }
}
customElements.define('my-greeting', MyGreeting);
```

No decorator syntax survives the transform. The output is what you'd write by
hand: `static properties`, constructor initialisation,
`customElements.define()`.

Works with or without `accessor`:

```ts
// Both produce the exact same output
@property({ type: String }) name = 'World';
@property({ type: String }) accessor name = 'World';
```

## Installation

```sh
npm i @gracile-labs/lit-macros
```

## Setup

```ts
// @filename: /vite.config.ts

import { litMacros } from '@gracile-labs/lit-macros';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    litMacros(),

    // ...
  ],
});
```

That's it. No tsconfig flags, no Babel plugins, no decorator configuration.

## Why "macros"

The name borrows from Vue's
[compiler macros](https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits)
(`defineProps`, `defineEmits`, …), compile-time constructs that vanish from the
output. But there's a key difference.

Vue macros are **compiler-only inventions**. `defineProps()` is not a real
function; it only exists for the SFC compiler. Your code is shaped around the
compiler's expectations, and it won't run without it.

Lit macros are **erasures of real runtime constructs**. `@property()`,
`@customElement()`, `@query()`. These are actual decorators that work today in
any environment that supports them. The plugin simply replaces them with the
equivalent static code that Lit's own runtime already understands.
`static properties` isn't a compiler fiction, it's the documented Lit API that
decorators are syntactic sugar for.

The analogy is a general-purpose CPU vs. a DSP: both execute the same task, but
the specialised path strips the overhead that generality demands. Decorators
carry the full weight of the TC39 decorator protocol (metadata, initialisers,
accessor wrapping, context objects). The macro output carries none of it,
because Lit never needed it.

This means:

- **No lock-in.** Remove the plugin, your decorators still work. They're real
  JavaScript.
- **No dialect.** You don't learn a new API or reshape your code. You write
  standard Lit.
- **No cliff.** If the plugin can't transform something (dynamic arguments,
  non-literal values), the decorator is left as-is. Graceful degradation, not
  hard failure.

## Why at all

### Decorator toolchain fragility

Decorators have been a source of instability for years. The spec went through
`2018-09`, `2021-12`, `2022-03`, `2023-05`, `2023-11` revisions, each with
subtly different semantics, each requiring its own Babel plugin option or SWC
`decoratorVersion` flag. TypeScript shipped its own `experimentalDecorators`
flavour that diverges from all of them.

As of Vite 8, this is a **concrete breakage**, not a theoretical risk.

At the time of writing:

- Vite 8 replaced esbuild with OXC for transforms.
- OXC does **not** support lowering TC39 Stage 3 decorators
  ([oxc#9170](https://github.com/oxc-project/oxc/issues/9170), open, no
  timeline).
- OXC does **not** support emitting `accessor` in certain positions
  ([oxc#20133](https://github.com/oxc-project/oxc/issues/20133)).
- Rolldown is blocked on OXC
  ([rolldown#7327](https://github.com/rolldown/rolldown/issues/7327)).
- Standard decorators (`experimentalDecorators: false`) in Lit components
  produce `SyntaxError: Invalid or unexpected token` at runtime in Vite 8's SSR
  module runner.
- The [official workarounds](https://github.com/vitejs/vite/discussions/21891)
  are to bolt on `@rolldown/plugin-babel` with
  `@babel/plugin-proposal-decorators` (picking the right `version` string), or
  SWC (`2022-03` only, not `2023-11`). Both add a compile step for something
  that shouldn't need one. Babel, by design, is slower than OXC.

Lit macros sidestep this entire problem. The output is plain JavaScript. No
decorator syntax survives the transform. It works on every version of Vite,
every bundler, every TS config, and every runtime, because there's nothing left
to lower.

### Less code

Standard TC39 decorators emit heavy boilerplate per class:

```js
let _MyEl_decorators, _name_decorators, _name_initializers, _name_extraInitializers, …
__esDecorate(…); __runInitializers(…);
```

The `__esDecorate` helper alone is ~40 lines of dense runtime code, duplicated
or shared across every decorated class. Legacy decorators
(`experimentalDecorators`) are lighter but still emit `__decorate()` +
`__metadata()` wrappers.

The macro output has no helpers. No runtime wrapper functions. Lit already knows
how to handle `static properties`; the decorators were always just sugar over
it.

### Less imports

Decorator-based Lit components pull in `lit/decorators.js`, a module that
re-exports from `@lit/reactive-element/decorators/*.js`, fanning out into 8+
sub-modules. Each import means resolution time, module-graph edges, and bundler
work. The macro strips these entirely when all specifiers are consumed. The
module graph shrinks, the bundler has fewer nodes to traverse, hash, and chunk.

### Faster runtime initialisation

Decorator machinery runs JavaScript at class definition time: walking metadata,
calling initialiser functions, setting up accessors through the decorator
protocol. `static properties` is processed by Lit's own `createProperty()` which
directly defines reactive accessors on the prototype. Fewer indirections, fewer
allocations, fewer function calls on first paint.

### More inspectable output

Decorated code is hard to read in devtools. You see `__esDecorate` call stacks,
`__runInitializers` sequences, and wrapper functions that obscure the actual
class shape. After the macro transform, what you see in the browser / build
output is a plain class with a static properties block and a
`customElements.define()` call.

### Smaller dependency surface

With decorators removed, downstream tooling no longer needs to understand or
configure decorator syntax:

- No `experimentalDecorators` / `emitDecoratorMetadata` tsconfig dance
- No Babel decorator plugins
- No bundler-specific decorator handling quirks
- TypeScript's `--erasableSyntaxOnly` (TS 5.8+ / 6.x) works out of the box

### Predictable & auditable

The transform is purely mechanical: it maps well-known identifiers from
well-known import sources to well-documented Lit static APIs. No type
information needed, no cross-file analysis, no magic. If a decorator argument
isn't a static literal, it's left untouched. What you write is what you get.

## Decorator → Static Equivalent Mapping

| Decorator                       | Static output                                                               | Status |
| ------------------------------- | --------------------------------------------------------------------------- | ------ |
| `@customElement('tag')`         | `customElements.define('tag', Class)` after class                           | ✅     |
| `@property(opts)`               | `static properties = { field: opts }` + constructor init                    | ✅     |
| `@state(opts?)`                 | `static properties = { field: {state: true, …opts} }` + constructor init    | ✅     |
| `@query(selector)`              | `get field() { return this.renderRoot?.querySelector(…); }`                 | ✅     |
| `@queryAll(selector)`           | `get field() { return this.renderRoot?.querySelectorAll(…); }`              | ✅     |
| `@queryAsync(selector)`         | `get field() { return this.updateComplete.then(() => …querySelector(…)); }` | ✅     |
| `@queryAssignedElements(opts?)` | `get field() { … slot.assignedElements(…) … }`                              | ✅     |
| `@queryAssignedNodes(opts?)`    | `get field() { … slot.assignedNodes(…) … }`                                 | ✅     |
| `@eventOptions(opts)`           | _Stores options on method for Lit's template event binding_                 | ⏳     |

All transforms are **purely static**: decorator arguments must be literal
values. Non-static arguments (function calls, variables) are left untouched and
the decorator is preserved as-is. No type information or cross-file analysis
required.

## What the alternatives look like

Try in the TS
[playground](https://www.typescriptlang.org/play/?useDefineForClassFields=true&target=12&ssl=8&ssc=1&pln=1&pc=1&experimentalDecorators=true#code/JYWwDg9gTgLgBAbzgGWDAogGwKYmwOxgBo4ALGETEgYwGda4BfOAMyghDgHJM0uBuALAAoUJFiI41AK60YHLLgLE4YdmGywAnk1btOPNAHoAJtmrQAhvKi0AdACtaAkXBHYAHuPjVMl+nAAKthyAELSMPL4cJ4wBCYMqBg4eISIIgCQAAJqEBraABRIUNgsONQwAFxwMFDS2EwAlHAtAG6WUMCWhNVcZiyW0pgwXHAAvABE-YPDE64ijCJAA).

**Input**:

```ts
import { property } from 'lit/decorators.js';

export class TestButton extends LitElement {
  @property({ reflect: true }) variant: 'default' = 'default';
}
```

**With `experimentalDecorators: false`, `useDefineForClassFields: true`**:

<details>

<!-- prettier-ignore -->
```js
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
let TestButton = (() => {
    let _classSuper = LitElement;
    let _variant_decorators;
    let _variant_initializers = [];
    let _variant_extraInitializers = [];
    return class TestButton extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _variant_decorators = [property({ reflect: true })];
            __esDecorate(null, null, _variant_decorators, { kind: "field", name: "variant", static: false, private: false, access: { has: obj => "variant" in obj, get: obj => obj.variant, set: (obj, value) => { obj.variant = value; } }, metadata: _metadata }, _variant_initializers, _variant_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        variant = __runInitializers(this, _variant_initializers, "default");
        constructor() {
            super(...arguments);
            __runInitializers(this, _variant_extraInitializers);
        }
    };
})();
export { TestButton };
```

😱

</details>

**With `experimentalDecorators: true`, `useDefineForClassFields: false`**:

<details>

<!-- prettier-ignore -->
```js
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
		var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
export class TestButton extends LitElement {
		constructor() {
				super(...arguments);
				this.variant = "default";
		}
}
__decorate([
		property({ reflect: true })
], TestButton.prototype, "variant", void 0);
```

**With Lit macros**, none of the above. Same output regardless of tsconfig:

```js
import { LitElement } from 'lit';
export class TestButton extends LitElement {
  static properties = {
    variant: { reflect: true },
  };
  constructor() {
    super();
    this.variant = 'default';
  }
}
```

</details>

### What `@eventOptions` does differently

Unlike the other decorators, `@eventOptions` attaches metadata to a method that
Lit's template event binding reads at runtime. It's rarely used (most Lit users
bind events with `@click=${this.handler}` without options). Planned, but not a
priority. It will likely be the last one implemented.

## Prior art: `@lit/ts-transformers`

The Lit team maintains
[`@lit/ts-transformers`](https://github.com/lit/lit/tree/main/packages/ts-transformers),
a set of TypeScript compiler transforms that do essentially the same job:
`@property` → `static properties` + constructor init, `@customElement` →
`customElements.define`, `@query*` → getters, etc. The output is nearly
identical.

So why redo this with OXC?

- **TS transformer API is not a public contract.** It works, and projects like
  [ts-patch](https://github.com/nonara/ts-patch) make it usable, but it's an
  internal compiler surface. TypeScript's Go rewrite (7.0) will
  [overhaul this entirely](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/#emit---watch-and-api).
  Transforms that depend on it will need to be rewritten or abandoned.

- **OXC is inherently stable.** The parser ships a well-defined ESTree AST.
  Bundler APIs move slowly by design (look at Rollup's plugin interface, largely
  unchanged for years). Rust codebases don't get casually rewritten. An
  OXC-based transform is closer to infrastructure than to a TS compiler plugin.

- **Vite integration is native.** `@lit/ts-transformers` requires wiring through
  `@rollup/plugin-typescript` or `ts-patch`. Lit macros is a plain Vite plugin
  (`enforce: 'pre'`), one line in your config, no TypeScript compiler
  customisation needed.

- **No type checker dependency.** `@lit/ts-transformers` runs inside the TS
  compiler and can optionally use the type checker (e.g.
  `constructorCleanupTransformer` uses it to simplify `super(...)` calls). Lit
  macros operates purely on syntax. Faster, simpler, no `Program` instance
  needed.

Both projects validate the same core idea: Lit decorators are thin sugar over
static APIs, and compiling them away is the right move. `@lit/ts-transformers`
proved the concept. Lit macros ports it to a foundation that won't shift under
your feet.
