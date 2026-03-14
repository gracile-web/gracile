# <i-c o='ph:code-block-duotone'></i-c>Working with assets

Thanks to its solid Vite foundations, you have plenty of ways to work with any kind of static or optimized assets, from fonts to WASM.

## Scripts and styles via HTML tags

There are multiple cases for using HTML tags for importing client-side JS or CSS:

### 1. Globally, at the `document` level

When you are associating multiple routes with the same [enclosing document](/docs/learn/usage/defining-base-document/), you might want to inject shared
assets for them.

<!-- As seen in the example above, each tag will be an entry point for bundles.
Want to split? Add a tag. Want to group and optimize multiple modules together?
Just import them from a unique entry point, Rollup will do the rest. -->

```html
<link rel="stylesheet" href="/src/document.scss" />
<script type="module" src="/src/document.client.ts"></script>
```

You can always add more `link` or `script`, but it's probably cleaner to add CSS `@import` or JS `import`
in single entry points, for you own sources or those from vendors.

> [!IMPORTANT]  
> While it is strongly recommended to use `.js` even for TS, and **relative** paths,
> not absolute,
> these rules **won't apply in HTML** when using Vite / Rollup based
> systems for bundle entrypoints.
> You have to provide the **full real path** relative to the project root, like
> `/src/components/my-element.ts`.  
> Same for non-vanilla CSS.

Alternatively, you can use this notation, with `URL` and `import.meta.url`:

```ts twoslash
new URL('./my-asset.css', import.meta.url).pathname;
```

E.g.

```ts twoslash
// @filename: /src/document.ts

import { html } from '@gracile/gracile/server-html';

export const document = html`
  <head>
    ...
    <link
      rel="stylesheet"
      href=${new URL('./document.css', import.meta.url).pathname}
    />
    <script
      type="module"
      src=${new URL('./document.client.ts', import.meta.url).pathname}
    ></script>
    ...
  </head>
`;
```

It's arguably more verbose but it is also a more canonical way to achieve this endeavour.  
Dealing with relative paths can be preferable, too.

For both dev. and build, Vite will resolve those paths for you properly.

---

This works, too, for explicit entry point grouping:

```html
<script type="module">
  import '/src/document.client.ts';
  import '/src/my-lib.ts';
</script>
```

Note that Vite will deduplicate/bundle per-route assets properly for build. E.g.

```html
<script type="module" src="/src/alpha.ts"></script>
<script type="module" src="/src/beta.ts"></script>
<script type="module" src="..."></script>

<!-- NOTE: It becomes one after build -->
<script type="module" src="/assets/page-bundle-123h4sh.js"></script>
```

<!-- OBSOLETE -->
<!-- If you're concerned about module script locations, which will happen right after the opening `<body>` of the containing document, note that after build, Rollup
will put them at the "proper" place before the closing `</body>`.
Inline scripts (immediately invoked), style tags and CSS links will be left in place. -->

### 2. Per-route assets injection

```ts twoslash
// @filename: /src/document.ts

import { html } from '@gracile/gracile/server-html';

export const document = () => html`
  <!doctype html>
  <html lang="en">
    <head>
      ...

      <!-- TIP: Route sibling page assets will be appended here, right before the closing HEAD -->
    </head>

    ...
  </html>
`;
```

<!-- Using the `helper.pageAssets` in your document will automatically provide all route sibling assets. -->

Given:

<div class="file-tree">

- project/
  - src/
    - routes/
      - my-page.ts
      - my-page.css (or `.{scss,less,…}`)
      - my-page.client.ts
  - ...

</div>

Result in:

```html
<link rel="stylesheet" href="/src/routes/my-page.css" />
<script type="module" src="/src/routes/my-page.client.ts"></script>
```

This mechanism isn't here just for convenience, but to make to streamline the way the _server_ handler will be generated (but it's also useful for static mode).  
Putting all route assets at the document level allows for deterministic optimizations by the bundler at build time, which wouldn't be possible (at least easily) at run time.

<!-- It's an opt-in, explicit feature here. You're free not to always incorporate it. -->

### 3. Anywhere in a server template

You can also put `script` (module or inline) and `link` anywhere in your HTML
partials or server-rendered Lit Elements, but it's not a recommended way.

First of all, it makes static analysis harder, for things like modules preloader. Also, it's generally recommended to put assets in `<head>` for
performance reasons, not in semi-random places in the body.  
This rule is not set in stone, though. You might have legitimate reasons for doing otherwise.

For static build, Vite will handle this just fine and apply optimizations on the
whole page at once, it will even put modules (async) in the `<head>` for you, with preloaders.  
However for server output, since your page output is not deterministic, those
will not be hoisted in the head.  
You'll have to make sure to use the "`URL` + `import.meta.url`" syntax, not `/src/foo/bar.ts`;
That way, the correct path will be dynamically injected in place when building the Gracile server handler for production, hence, matching the dev. behavior.

<!-- NOTE: Should we encourage that ? -->
<!-- Otherwise, with the *static* mode, you should can put asset bundle entrypoint anywhere, including in page. -->

<!-- TODO: Separate "Assets section" -->
<!-- TODO: Explanation for "as-is" assets, e.g.: -->
<!-- await import(
  /* @vite-ignore */
  new URL('../../pagefind/pagefind-ui.js', import.meta.url).href
); -->

## The `public/` folder for static assets

As you know, Gracile is built on top of Vite, so
naturally, it will inherit Vite's capabilities like serving assets _as-is_,
from the `public` directory.

Putting an asset in it, will make it available from the base URL, e.g., `/public/favicon.svg` → `/favicon.svg`.

More details on the [Vite docs](https://vitejs.dev/guide/assets#the-public-directory).

## Exotic file formats

For anything outside the realm of HTML/CSS/JS, you have a large collection of Vite
plugins to cater to your needs.

Vite provides `?raw` or `?inline` flags, web workers loading mechanisms etc.
Gracile support this, naturally, but also provides a handful of plugins specifically
tailored to `html` template literals.

---

[Checkout the Add-ons](/docs/add-ons/).
