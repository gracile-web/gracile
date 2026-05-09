# Client-side router<i-c o=ph:flask></i-c>

Quickly add a description, title, open graph, etc. in your page's document
head.  
This add-on will take care of the nitty-gritty.

> [!CAUTION]  
> Experimental. This is not well tested, nor it is customizable enough.

## Installation

```sh
npm i @gracile-labs/client-router
```

Activate
[page premises](https://gracile.js.org/docs/learn/usage/progressive-interactivity/#doc_expose-the-page-premises/):

```ts
// @filename: ./vite.config.ts

import { defineConfig, type PluginOption } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

export default defineConfig({
  // ...
  plugins: [
    gracile({
      pages: { premises: { expose: true } },
    }),
    // ...
  ],
});
```

## Usage

After installing the `@gracile-labs/client-router`, you can create a client
router instance and add it to your document client scripts:

```ts
// @filename: ./src/client-router.ts

import { createRouter } from '@gracile-labs/client-router/create';

// TIP: As an event target, you can listen to events or navigate programmatically from anywhere.
export const router = createRouter();

// @filename: ./src/document.client.ts

import './client-router.js';

// @filename: ./src/routes/(home).ts

import { router } from '../client-router.js';

// ...
if (!isServer) {
  // ...

  // NOTE: Trigger as soon as a new URL is requested.
  router.addEventListener('route-changed', () => {
    this.isSearchBoxVisible = false;
  });

  // NOTE: Trigger when the route template is fully rendered and displayed.
  router.addEventListener('route-rendered', () =>
    requestIdleCallback(() => initCardsHover()),
  );

  // NOTE: Programmatic navigation.
  setTimeout(() => {
    router.navigate('/docs/');
  }, 2000);
}
```

## Script behavior during client-side navigation

When the client router takes over, navigating between routes no longer triggers
a full page reload. This has implications for how `<script>` elements in the
document `<head>` are handled.

### External scripts (`<script type="module" src="…">`)

Scripts with a `src` attribute are reconciled by URL. When navigating to a route
whose document contains a script not yet present on the page, the router
dynamically imports it via `import()`. Thanks to ESM semantics, modules that
were already loaded are **not** re-executed — deduplication is free.

This is the normal path for Vite-processed entry points and sibling client
scripts. No special handling is needed.

### Inline scripts (`<script>` / `<script type="module">` without `src`)

> **Design rationale** — A user expects an inline script to behave the same
> whether the page was reached via the browser URL bar (full load) or via
> client-side navigation. Not re-running inline scripts on a CSR route change
> would be a surprising deviation from that mental model. Both Turbo Drive and
> Astro's `<ClientRouter />` take the same stance: inline scripts are
> re-executed after every navigation.

On every CSR route change, the router:

1. **Removes** all existing inline scripts from `<head>`.
2. **Clones** each inline script from the incoming document into a fresh
   `<script>` element and appends it to `<head>` — the browser executes it.
3. Preserves **document order**, so dependency chains between scripts work as
   expected.

This applies to both classic `<script>` and `<script type="module">` without a
`src` attribute.

> [!NOTE]  
> Vite typically extracts inline `<script type="module">` from your HTML into
> external `<script src="…">` proxies (in dev and build). True inline module
> scripts are uncommon but fully supported if you need them.

### Opting out: `data-gracile-no-rerun`

If an inline script should only run once (e.g. analytics snippets, global
polyfills), add the `data-gracile-no-rerun` attribute. The router will skip
re-execution for that script on subsequent navigations.

```html
<script data-gracile-no-rerun>
  // Runs on initial page load only — skipped during CSR navigation.
  initAnalytics();
</script>
```

### Making inline scripts idempotent

When a script _does_ re-run on every navigation, you may want to guard against
duplicate side-effects. A simple pattern using a well-known `Symbol`:

```html
<script>
  const key = Symbol.for('my-widget-init');
  if (!window[key]) {
    window[key] = true;
    // One-time setup…
  }
  // Per-navigation work…
</script>
```

This gives you fine-grained control: the guarded block runs once, while
everything outside the guard runs on every route change — matching the behavior
of a fresh page load followed by in-page updates.
