# `@gracile-labs/hmr-v2`

> Placeholder for future fine-grained Lit HMR.  
> Houses the **"god test suite"** for ALL HMR scenarios across the Gracile
> stack.

## Why this package exists

HMR in Gracile is a multi-layer story. Each layer is self-contained, but they
must coexist without stepping on each other. This package sits at the
**outermost layer** — the only place that can exercise the full vertical: server
→ client → CSS, end-to-end, with a real Vite dev server and a real browser.

## Architecture — the three HMR floors

### 1. Base (engine)

The sturdy, gross, reliable foundation. Classic meta-framework patterns:

- **Full SSR reload** when server-affecting code changes (route modules, their
  transitive deps).
- **Soft client reload** for `.client.` files (auto `import.meta.hot.accept()`).
- **CSS hot update** for sibling `.css` files (Vite native).
- Predictable, matches what Next.js / Astro / SvelteKit users expect.
- CE registry patching (block/unblock orphaned custom elements on HMR).

### 2. `vite-plugin-standard-css-modules`

**File-boundary-based** hot swap with minimal browser runtime tricks:

- One file = one swap. CSS is side-effect free, so this is sturdy by design.v
- Swap DSD `<style>` by query + markers, or mutate cross-referenced
  `CSSStyleSheet` instances via `replaceSync()`.
- Totally self-contained — keeps its own detailed test suite in-package.
- In hmr-v2 we only **smoke-test boundaries** (no clash with base or Lit HMR).

### 3. HMR V2 (this package — future)

Spiritual **Lit-only** successor to the original `@gracile-labs/hmr` (which is a
fork-of-a-fork from an ancient project). Aims for custom element hot patches _as
far as we can go_:

- Methods, state (`@property`, Lit signals…), templates, `static styles =`.
- **Good neighborhood policy**: no clash with base engine HMR or
  `with { type: 'css' }` HMR.
- CE registry patching (avoid double registrations on re-evaluation).
- **NEW: SSR DOM swapping** — hot-swap server-rendered HTML without full page
  reload. See [future vision](#future-ssr-dom-swapping) below.

## Scenario matrix

| Changed file                           | Layer       | Expected behavior                      | Status   |
| -------------------------------------- | ----------- | -------------------------------------- | -------- |
| Route entry (`.ts`)                    | Base        | Full SSR reload                        | ✅       |
| `_helper.ts` in `routes/`              | Base        | Full SSR reload                        | ✅       |
| `features/_helper.ts` (outside routes) | Base        | Full SSR reload                        | ✅       |
| `.client.ts` (sibling asset)           | Base        | Soft client reload (no SSR)            | ✅       |
| `document.client.ts` (deep import)     | Base        | Soft client reload (no SSR)            | ✅       |
| `.css` (sibling asset)                 | Base        | CSS hot update (no reload)             | ✅       |
| `.css` via `with { type: 'css' }`      | CSS modules | `replaceSync()` in-place               | 🔲 smoke |
| `.css` via `with { type: 'css-lit' }`  | CSS modules | `replaceSync()` via CSSResult          | 🔲 smoke |
| Lit element template                   | HMR V2      | Hot patch (no reload, state preserved) | 🔲 TODO  |
| Lit element `static styles`            | HMR V2      | Hot patch styles                       | 🔲 TODO  |
| Lit `@property` / signals              | HMR V2      | Hot patch reactive props               | 🔲 TODO  |
| CE `define()` re-evaluation            | HMR V2      | Registry patch (no double reg)         | 🔲 TODO  |
| SSR DOM swap                           | HMR V2      | Morph server HTML in-place             | 🔲 TODO  |

## God test suite rationale

The test suite lives here (not in `engine` or
`vite-plugin-standard-css-modules`) because:

- **Engine** doesn't touch actual browser runtime (no CE patching, no adopted
  sheet swapping).
- **vite-plugin-standard-css-modules** is totally self-contained (a file → a
  swap, CSS is pure).
- **HMR V2** is the outermost layer. It touches everything: server, client, CSS.
  It's the only place where cross-layer interference can be caught.

## Future: SSR DOM swapping

> Memo — this is forward-looking, not implemented yet.

The engine already has all the infrastructure:

- **Page premises**: the SSR render pipeline produces full HTML + JSON route
  props, fetchable from the client.
- **Client Router** already does successful DOM morphing using real HTML from
  premises + JSON props.

The vision: when an SSR-affecting file changes, instead of a full page reload,
fetch the new SSR HTML via premises and **morph the live DOM** in-place. This
would:

- Preserve client state (scroll position, form inputs, component state).
- Use Lit's `render(document.body)` / `hydrate()` for light DOM.
- Reuse the client router's morph mechanism for the rest of the page.
- Give Gracile a real edge: SSR frameworks typically lose all client state on
  server changes. This wouldn't.

## Running tests

```sh
# From this package directory
pnpm test:integration

# Or from monorepo root
pnpm --filter @gracile-labs/hmr-v2 test:integration
```
