# Progressive interactivity

There are up to 6 layers to choose from when it's time to augment your web project with JavaScript. From pure static HTML, to a full-blown web-app experience, with hydration and client-side routing.

1. **Full static**  
   Pre-rendered HTML pages, without JS at all.
2. **Semi static**  
   Surgically inserted bits of JS, for basic interactions.
3. **Progressively enhanced**  
   "Invisible" Custom HTML elements, loaded smartly.
4. **Islands**  
   Custom (Lit) HTML elements, loaded smartly and hydrated.
5. **Whole-page hydration**  
   The route root body template is interactive.
6. **Client-side routing**  
   On route change, the page is re-rendered with its JS template and new properties.

**5** and **6** are a bit special. They load the same route modules on the client and the server.  
By being holistic, they require to embrace a different mental model.

In this guide, we will explore each of these layers and see how they can be interleaved.

## Layers

### 1. Full static

Just make sure to use the Lit SSR server `html`, which is a bit more performant, and doesn't leave hydration markers in your rendered HTML markup (`<-- lit-… -->`).  
It's re-exported from `@gracile/gracile/server-html`.

You really have nothing special to do beside this precaution.  
Gracile is no-JS by default.

### 2. Semi static

You can add inline `<script>`s within your template, or inside your main script entry point.

See the [Defining base document](/docs/learn/usage/defining-base-document/) page.

From there, you can use the numerous DOM APIs to target specific static markup parts and make them alive.

Beware that this is suited for content oriented website, where interactivity is kept to basic endeavors, like color mode toggle, bare HTML forms…

### 3. Progressively enhanced

Sometimes, you need interactivity for things that will not be visible to the user until some action is done.  
Things like tooltips, color mode toggles, context menus, search bars, forms…  
This means that code will just have to run on the browser and never on the server.
That also means you still don't need any hydration mechanism at this point - so that is fewer KBs over the wire.

This is a perfect scenario for Custom Elements, where you will "augment" an existing part of markup, with or without Shadow DOM.

This pattern is almost an Island like pattern, but with less complexity, because we skip the whole server story here.

Note that, like the "Island" pattern just below, you are free to load the component eagerly, lazily, or in a user action-aware fashion.

### 4. Islands

Make sure to load this client-script, as eagerly as possible:

```ts
import '@gracile/gracile/hydration-elements';
```

This will bootstrap the hydration mechanisms for Lit Custom Elements, as soon as they are defined.

TODO

<!-- It's not strictly speaking "Islands", as you're mostly using native platform capabilities.   -->
<!-- However, those patterns share the same goal: loading JavaScript and **hydrate** the
DOM in a lazy fashion. -->

<!-- The "Island" pattern was -->

Hydration is needed because on the first request, user will get the Custom Element as a pre-rendered HTML chunk, alongside its hydration markers, housed in the Declarative Shadow DOM.

<!-- Hydration has a benefit to be aware of:  fewer work on the browser; no need to render, just reconcile.

From there, you will need to load this Gracile helper that will make your Lit Element aware of hydration processes.
It's very important to include this bit if you don't want your Lit Custom Element to be rendered twice! -->

### 5. Whole-page hydration

> [!CAUTION]
> Experimental.
> This is not well tested, nor it is customizable.

Sometimes, you need more than isolated Islands of interactivity.  
For example, you may want to attach event handlers to your templates in the Light DOM.

For this task, make sure to load this client-script, as eagerly as possible this hydration bootstrapper:

```ts
// @filename: ./src/document.client.ts

import '@gracile/gracile/hydration-full';
```

It will load the route module in the browser, and hydrate the SSRed markup.

When changing a route, by clicking a link, or navigating the history, your website will behave as any "MPA"; the whole page context will be blown away.

> [!IMPORTANT]  
> You need to [expose the page premises](/docs/learn/usage/progressive-interactivity/#doc_expose-the-page-premises) for the whole page hydration strategy to work.

### 6. Client-side routing

> [!CAUTION]
> Experimental.
> This is not well tested, nor it is customizable enough.

If you want to persist your page state between routes, you will need to resort to a client-side router.  
Luckily, Gracile has [an add-on for that](/docs/add-ons/client-router/), which is a fork of [thepassle/app-tools](https://github.com/thepassle/app-tools) router.

It intercepts links clicking and history navigation, pick up the associated page premises (properties and templates), then the Lit client renderer do its work.

Since the markup is already there on first page load, Lit not render on the client, it will just hydrate the page body and custom elements.

This SPA router is still in an early phase, but it already supports quite a lot.

> [!IMPORTANT]  
> Similarly to the whole-page hydration, you need to [expose the page premises](/docs/learn/usage/progressive-interactivity/#doc_expose-the-page-premises) for client side routing to work.

See the full documentation for the [client side router](/docs/add-ons/client-side-router/).

## Guidance

### Expose the page premises

To activate page premises, make sure to [configure Gracile priorly](/docs/add-ons/client-router/), with the `pages.premises.expose` flag on.

---

Gracile comes with the concept of "**page premises**".

By default, the Gracile handler will expose your routes like this:

- `/src/routes/(home).ts` → `/`
  - `/index.html`
- `/src/routes/about.ts` → `/about/`
  - `/about/index.html`
- …

With page premises, each route will have its properties and document exposed:

- `/src/routes/(home).ts` → `/`
  - `/index.html`
  - `/__index.doc.html`
  - `/__index.props.json`
- `/src/routes/about.ts` → `/about/`
  - `/about/index.html`
  - `/about/__index.doc.html`
  - `/about/__index.props.json`
- …

You don't really need to be aware of this, as Gracile will consume those endpoints under the hood for you. But it's important to acknowledge that, to not be surprised.

It's a useful primitive that expose what your routes are made of, but at a more granular level, before it is fully rendered to HTML.  
Its main application is providing a hook for client side operations, where you need pure data, or the minimal HTML required for diffing the `<head>` scripts and styles.

Gracile is using this hook for its **5th** and **6th** interactivity strategies.

If you don't need this level of interactivity, **YOU SHOULD KEEP THIS OPTION DISABLED**, to avoid superfluous endpoints and/or built artifacts.

---

Page premises are live endpoint when a route is dynamic.  
When a specific route is pre-rendered (in server mode) or the site is fully pre-rendered (SSG), it will put the premises alongside the route main indexes.

### Hydration and loading strategies

#### Loading when the browser is idle

As an illustration, the very docs website you are visiting right now has a search bar which is made of numerous JS-heavy modules.  
There is the Pagefind engine UI, Pagefind index chunks (with WASM), the Shoelace dialog component, the `<search-popup>` custom element itself, the CSS…

All this doesn't need to be loaded eagerly, this is why you can defer these tasks when
everything else is settled.

Hopefully, you got the native `requestIdleCallback` global function just for accomplishing this!

Combined with lazy ES Module (`import(…)`), Vite/Rollup smart bundling, the Custom Elements registry, and Lit's auto-hydration, you'll get a full-fledged "Island" pattern to work with.

First we got this template partial. When loading this payload in the browser, everything is static (for now):

```ts twoslash
// @filename: /src/modules/site-search.ts

import { html } from 'lit';

export function siteSearch() {
  return html`
    <div class="m-site-search">
      <!-- v—— Not loaded yet! It is just a generic element for now -->
      <search-popup>
        <button>Search</button>
      </search-popup>
    </div>
  `;
}
```

Our `<search-popup>` component can look like this:

```ts twoslash
// @filename: /src/features/search-popup.ts

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './my-dialog.js';
// ...
// NOTE: This will be loaded lazily alongside the web component.
await import('./my-HEAVY-stuff.js');

@customElement('search-popup')
export class SearchPopup extends LitElement {
  render() {
    return html`
      <!-- The button in light DOM will be slotted here -->
      <slot></slot>

      <my-dialog>
        <!-- ... -->
      </my-dialog>
    `;
  }
}
```

And now, the magic trick is:

```ts twoslash
// @filename: /src/modules/site-search.client.ts

requestIdleCallback(() => import('../components/search-popup.js'));
```

That's all you need for deferring non-visible components when your user browser has finished doing critical work; after the page has loaded.  
Note that for everything visible right away, you should avoid this technique
or it will cause a flash of unstyled content (FOUC).

> [!IMPORTANT]
> You might need [a](https://github.com/pladaria/requestidlecallback-polyfill) [polyfill](https://github.com/aFarkas/requestIdleCallback) for `requestIdleCallback`!  
> As often, Gracile avoids shipping implicit features like these.

<caniuse-embed feature="requestidlecallback" periods="future_1,current,past_1,past_2"></caniuse-embed>

<div class="git-only">

[`requestIdleCallback` on caniuse.com](https://caniuse.com/requestidlecallback)

</div>

#### Load on user interaction

Do the same as the first example above, but instead of using `requestIdleCallback` in
the client script, you could do something like:

```ts twoslash
// @filename: /src/modules/site-search.client.ts

// NOTE: It will be imported once in the module graph, anyway, so this check is optional.
let searchPopupLoaded = false;

document.querySelector('search-popup').addEventListener('mouseenter', () => {
  if (searchPopupLoaded) return;

  import('../components/search-popup.js');
  searchPopupLoaded = true;
});
```

You have total control on how you want to selectively "hydrate".  
You can
use any kind of interaction, with `IntersectionObserver`, when clicking specific elements, etc.

You could also generalize you preferred approaches with a declarative pattern, like adding `data-load-on="idle|hover|visible|..."` on the elements to target.

### IMPORTANT: client/server code execution

When using the **5th or 6th interactivity strategy**, Gracile will load your defined routes in your client bundle, for the hydration/rendering process to work.

You need to acknowledge that **ALL CODE WRITTEN ON THE SERVER WILL BE ACCESSIBLE IN THE CLIENT SIDE**.

You will not be required to use a sibling `my-route.client.ts` file for loading client-side only script anymore, but **that remain a very useful option**, if you want to make a clear distinction between client/server realms.

Otherwise, you can use a conditional, like the `isServer` flag offered by `lit`, that will make sure that in a **Server** based environment, the code will be tree-shaken - effectively removed from the client bundle.

```ts
import { isServer } from 'lit';

if (!isServer) requestIdleCallback(() => init());
```

This flag is based one the [`node` export condition](https://nodejs.org/api/packages.html#conditional-exports).

You can also use the [Gracile `nodeCondition` helper for that](/docs/references/api/server-runtime/#doc_variable-nodecondition).
