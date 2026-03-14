# <i-c o='ph:signpost-duotone'></i-c>Defining routes

Like every full-stack meta-framework, routes are the central concept of Gracile.  
This is where everything got tied together, and besides that, and add-ons, there aren't many opinions left.

Gracile comes with a dedicated function that will take care of
typings as with JS or TS, and nothing more.

Under the hood, it uses the [`URLPattern` API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) which uses converted patterns like this:

- `/src/routes/foo/[param]/foo.ts` → `/foo/:param/foo`
- `/src/routes/bar/[...path]` → `/bar/:path*`

### Index

You have **two** ways to define an index for a folder.

1. Using like: `foo/my-folder/index.ts`
2. With parentheses like: `foo/(anything).ts`, `foo/(foo).ts`…

---

Respectively:

1. `/src/routes/foo/index.ts` → `/foo/`
2. `/src/routes/foo/(foo).ts` → `/foo/`

The parentheses pattern is especially useful for quick file switching with your IDE, where a lot of `index`es can be confusing, same when debugging an error trace.  
Note that when indexes are noted that way, the first one will be chosen (alphabetically).

## Ignored files and directories

- **Client**-side sibling **scripts** (`<ROUTE>.client.{js,ts}`)
- **Client**-side sibling **styles** (`<ROUTE>.{css,scss,…}`)
- Leading **underscore** `_*.{js,ts}`, `_my-dir/*`
- Leading **dotfiles**/directories (hidden on OS).

## `defineRoute` parameters

<!-- is a "dummy" function in the sense that it doesn't do anything to your configuration at runtime, but it -->

The `defineRoute`
provides a type-safe API that can be used with JavaScript or TypeScript.  
It's analog to how numerous OSS projects are providing their configuration API (like Vite's `defineConfig`).

<!-- You could export like `export default { document: ..., page: ... }` and it would work, but you'll lose type-safety. -->

### `document`

Provides the [base document](/docs/learn/usage/defining-base-document/) for the route's page template.  
Given a pre-existing document, you'll import it like this in your route configuration:

```ts twoslash
// @filename: /src/document.ts

import { html } from '@gracile/gracile/server-html';

// [!code word:document:1]
export const document = (props: { url: URL }) => html`
  <html>
    <head>
      <!-- ... -->
      <title>${props.url.pathname}</title>
    </head>
    <body>
      <route-template-outlet></route-template-outlet>
    </body>
  </html>
`;

// @filename: /src/routes/my-page.ts

import { html } from 'lit';
import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.js'; // [!code highlight]

export default defineRoute({
  document: (context) => document(context), // [!code highlight]

  template: () => html`...`,
});
```

### `template`

Provides a server-renderable template.  
When **combined** with an enclosing `document`, we'll call it a "**Page**".  
When used **alone**, we'll call it an HTML "**Fragment**".

```ts twoslash
// @filename: /src/routes/my-page.ts

import { html } from 'lit';
import { defineRoute } from '@gracile/gracile/route';
export default defineRoute({
  // ...
  // [!code highlight:2]
  template: (context) => html`
    <main>
      <article class="prose">Hello</article>
    </main>
  `,
});
```

### `staticPaths`

Used with [**static** mode](/docs/learn/usage/output-modes/#doc_static-ssg) only.

You can provide `props` and `params` for populating page data.

**`template`** and **`document`** contexts will be properly typed thanks to the `staticPaths` function return signature.  
Hover `context.props` and `context.params` to see!

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';

export const document = (props: { url: URL }) => html`...`;

//---cut---
// @filename: /src/routes/[...path].ts

import { html } from 'lit';
import { defineRoute } from '@gracile/gracile/route';

import { document } from '../document.js';

export default defineRoute({
  // [!code highlight:2]
  staticPaths: () =>
    [
      {
        params: { path: 'my/first-cat' },
        props: { cat: 'Kino' },
      },
      {
        params: { path: 'my/second-cat' },
        props: { cat: 'Valentine' },
      },
    ] as const,

  document: (context) => document({ ...context, title: context.props.cat }),

  // NOTE: Hover the tokens to see the typings reflection.
  template: async (context) => html`
    <h1>${context.props.cat}</h1>
    <main>${context.url.pathname}</main>
    <footer>${context.params.path}</footer>
  `,
});
```

### `prerender`

For `server` output only.  
Will generate a **full HTML file** as if it was generated from the `static` output mode.  
Useful for pages that don't need to be dynamic on the server side (e.g., contact, docs, about…).

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';

export const document = (props: { url: URL }) => html`...`;

//---cut---
// @filename: /src/routes/about.ts

import { html } from 'lit';
import { defineRoute } from '@gracile/gracile/route';

import { document } from '../document.js';

export default defineRoute({
  prerender: true, // [!code highlight]

  document: (context) => document(context),

  template: async (context) => html` <h1>I will be prerendered!</h1> `,
});
```

### `handler`

Used with [**server** mode](/docs/learn/usage/output-modes/#doc_server-mode) only.  
Like `staticPaths`, `handler` is a provider for `props` and can receive the current — matched route — `params`.

There are **two behaviors** for the handlers:

1. **Returning an instance of `Response`** will **terminate** the pipeline, without going through
   the `template` rendering that happens afterward otherwise.  
   Useful for redirects, pure JSON API routes…

2. **Returning anything else** will provide the typed `props` for the `template` to consume.

Minimal example:

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';
export const document = () => html`...`;
// ---cut---

// @filename: /src/routes/index.ts

import { html } from 'lit';
import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.js';

const achievements = [{ name: 'initial' }];

export default defineRoute({
  // [!code word:handler:2]
  // [!code word:POST:2]
  handler: {
    POST: async (context) => {
      const formData = await context.request.formData();

      const name = formData.get('achievement')?.toString();

      if (name) achievements.push({ name });

      return Response.redirect(context.url, 303);
    },
  },

  document: (context) => document(context),

  template: async (context) => html`
    <form method="post">
      <input type="text" name="achievement" />
      <button>Add an "Achievement"</button>
    </form>

    <ul>
      ${achievements.map((achievement) => html`<li>${achievement.name}</li>`)}
    </ul>
  `,
});
```

---

See also the ["Forms" recipe](/docs/recipes/working-with-forms/) for a full, contextualized example.

### HTTP methods

Note that, per the HTML specs, only `GET` and `POST` can be used with an HTML `<form>` element.  
Other methods like `DELETE`, `PUT`, etc. can be used, but Gracile won't pursue the route template rendering with them.  
A new method, "[`QUERY`](https://httpwg.org/http-extensions/draft-ietf-httpbis-safe-method-w-body.html)", is also inside the radar, and will possibly be implemented in `node:http` and other server environments.

### Minimal example

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';

export const document = (props: { url: URL; title: string }) => html``;

// ---cut---
// @filename: /src/routes/my-page.ts

import { html } from 'lit';
import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.js';

export default defineRoute({
  document: (context) => document({ ...context, title: 'My Page' }),

  template: ({ url }) => html`
    <main class="content">
      <article class="prose">
        <!-- ... -->
        Hello ${url.pathname}
        <!-- ... -->
      </article>
    </main>
  `,
});
```

## Bare pages (for redirects, etc.)

Sometimes, you don't want to bring a page template in a route, just a bare HTML document, maybe with some `<meta>`; perfect use-case: page redirects.

It's totally possible to skip the `template` altogether and just use a single, server-only `document`.

Here, we will redirect the user to another URL, while collecting some analytics,
all that with a nice and simple transitive screen:

```ts twoslash
// @filename: /src/routes/chat.ts

import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import discordLogo from '../assets/icons/discord.svg';
import { DISCORD_INVITE_URL } from '../content/global.js';
import { googleAnalytics } from '../document-helpers.js';

const waitTimeInSeconds = 2;

export default defineRoute({
  document: () => html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        ${googleAnalytics}

        <style>
          & {
            font-family: system-ui;
            color-scheme: dark light;
            /* ... */
          }
        </style>

        <title>Gracile - Discord Server (redirecting…)</title>

        <!-- NOTE: The current page, "https://gracile.js.org/chat/", will be forgotten from history after the redirection.  -->
        <meta
          http-equiv="refresh"
          content=${`${waitTimeInSeconds};URL=${DISCORD_INVITE_URL}`}
        />
      </head>

      <body>
        ${discordLogo}

        <p>Redirecting to the Discord invitation link…</p>
        <!-- NOTE: No need for the <route-template-outlet> here! -->
      </body>
    </html>
  `,
});
```

## What to put in routes?

Routes are the most basic unit of interaction with your user.

This is where you should do data fetching, and dispatch them to "components", "templates", "modules", "features" or whatever conventions you choose to represent this data.

It's generally better to use routes as entry points and not put too much UI or logic in there, besides what's strictly needed to bootstrap the page and forward the context to components.  
Routes are kind of "magic", in the sense that you're not calling them yourself in your
code, but the framework will use them predictably.
Thankfully, Gracile isn't crowding top level module exports, but just the default one, with the `defineRoute` helper.  
While it adds a level of indentation (versus a top level export), it avoids clashes with your module-scoped functions.  
This is a perfectly reasonable use of ESM default exports.  
No static analysis or extraction either, meaning your functions are not in silos and won't behave in unexpected ways due to custom pre-processing, which is very common in other frameworks.

## Client-side routing

**_For now_**, Gracile doesn't provide any CSR mechanism out of the box.

<!-- Due to the varying needs among developers, it's not in the scope, but at one
point, if it adds value (like client/server symbiosis) an add-on could be
created. -->

Note that the [Metadata add-on](/docs/add-ons/metadata/)
provides a `viewTransition` option that will make this browser native
feature quickly available to you (it is just a meta tag), but it's not supported outside Blink-based
browsers. It can be a nice progressive enhancement though, but not quite
the SPA feel you could get with user-land solutions.

Fortunately, there are plenty of options regarding CSR in the Lit ecosystem:

- [Lit's router](https://www.npmjs.com/package/@lit-labs/router)
- [Nano Stores Router](https://github.com/nanostores/router) with [Nano Store Lit](https://github.com/nanostores/lit)
- [Navigo](https://github.com/krasimir/navigo)
- [thepassle's app-tools](https://github.com/thepassle/app-tools/tree/master/router) router
- [Vaadin router](https://github.com/vaadin/router)
- [micromorph](https://github.com/natemoo-re/micromorph)

You might want to try DOM-diffing libraries, too.

## Miscellaneous

### Trailing slashes

For simplicity and predictability, Gracile is only supporting routes that end with a slash.  
This is for **pages** and **server endpoints**, not assets with file extensions.

Flexibility for the user will be added at one point, but this requires significant implementation work and testing,
so this is not in the scope yet.

> [!NOTE]
> The explanation below is extracted from the [Rocket web framework documentation](https://rocket.modern-web.dev/docs/basics/routing/#static-routes).

Below is a summary of investigations by [Zach Leatherman](https://www.zachleat.com/web/trailing-slash/) and [Sebastien Lorber](https://github.com/slorber/trailing-slash-guide)

**Legend**:

- 🆘 HTTP 404 Error
- 💔 Potentially Broken Assets (e.g., `<img src="image.avif">`)
- 🟡 SEO Warning: Multiple endpoints for the same content
- ✅ Correct, canonical or redirects to canonical
- ➡️ Redirects to canonical

<table class="fullwidth">
  <thead>
    <tr>
      <th></th>
      <th colspan="2"><code>about.html</code></th>
      <th colspan="2"><code>about/index.html</code></th>
    </tr>
    <tr>
      <th>Host</th>
      <th><code>/about</code></th>
      <th><code>/about/</code></th>
      <th><code>/about</code></th>
      <th><code>/about/</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://slorber.github.io/trailing-slash-guide">GitHub Pages</a></td>
      <td>✅</td>
      <td>🆘 <code>404</code></td>
      <td>➡️ <code>/about/</code></td>
      <td>✅</td>
    </tr>
    <tr>
      <td><a href="https://trailing-slash-guide-default.netlify.app">Netlify</a></td>
      <td>✅</td>
      <td>➡️ <code>/about</code></td>
      <td>➡️ <code>/about/</code></td>
      <td>✅</td>
    </tr>
    <tr>
      <td><a href="https://vercel-default-eight.vercel.app">Vercel</a></td>
      <td>🆘 <code>404</code></td>
      <td>🆘 <code>404</code></td>
      <td>🟡💔</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><a href="https://trailing-slash-guide.pages.dev">Cloudflare Pages</a></td>
      <td>✅</td>
      <td>➡️ <code>/about</code></td>
      <td>➡️ <code>/about/</code></td>
      <td>✅</td>
    </tr>
    <tr>
      <td><a href="https://trailing-slash-guide.onrender.com">Render</a></td>
      <td>✅</td>
      <td>🟡💔</td>
      <td>🟡💔</td>
      <td>✅</td>
    </tr>
    <tr>
      <td><a href="https://polite-bay-08a23e210.azurestaticapps.net">Azure Static Web Apps</a></td>
      <td>✅</td>
      <td>🆘 <code>404</code></td>
      <td>🟡💔</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

If you wanna know more be sure to checkout [Trailing Slashes on URLs: Contentious or Settled?](https://www.zachleat.com/web/trailing-slash/).
