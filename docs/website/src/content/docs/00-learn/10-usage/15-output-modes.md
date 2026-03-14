# Modes: SPA, MPA, SSG, SSR, CSR

MPA / SSR is the base on which Gracile is built.  
You can transform your project for two types of targets: "Server" and "Static".

**Static**

**Static-site generation** (aka SSG) is technically _ahead of time_ server-side rendering (aka SSR).  
You'll get a **portable artifact** to deploy pretty much anywhere, with HTML indexes, JS/CSS bundles and other static assets.

**Server**

**Server side renders** HTML pages on _user request_, provides API endpoints, serve static **client assets** and **pre-rendered pages**.

To fit nicely within your existing setup, Gracile builds an handler that you can consume within your app, with a dedicated or custom adapter.

The Gracile server handler/adapter combo can play nicely with **WinterCG** or **Node HTTP**-like runtime and frameworks.

## Definitions

### Single Page Application (SPA)

The Vite Lit SPA template, with `npm create vite -t lit` for example, is already
a great base for making highly dynamic, client web apps.

Keeping this in mind, you might want to upgrade to something a bit more featureful as
soon as the project grows, without breaking your existing Vite setup.

That's where Gracile comes into play: per-route splitting is a very powerful feature that,
in itself, is an incentive to use a full-stack framework.  
Combined with CSR, view transitions, or just for serving well-separated parts
of your app, you'll also get the folders to URL mapping convention,
which has proven to greatly benefit decent-sized projects/teams.

It's not an "all or nothing" approach. Some leaves of your apps can be SPA-like, others can be MPAs, with or without client-side routing augmentation.  
You might even want to serve different, technically unrelated SPAs from a
single build/deployment.

SPAs are typically deployed from a static distributable.  
With Gracile you'll use the `static` output for that case.

### Multiple Pages Application (MPA)

Every page will get pre-route assets splitting.

MPA can be static or server-side rendered, but unlike SPA they will do
a full refresh on a route change, meaning you'll have to maintain the
client state in different ways (there are plenty!).

However, it's possible to augment an MPA with Client-Side routing (see below).

### Client-Side Routing (CSR)

Client-Side Routing in the case of an SPA, is entirely done from the bundled
app running in the browser.

At first glance, this seems to be irreconcilable with the file-based, old-school
web server's way of handling routing tasks.

However, it's possible to combine the best of both worlds:

- Robustness of a server-pre-generated HTML response.
- Snappiness of a JS-based page re-rendering
- SEO boons (yes, Google understands JS, but not all bots are running JS)
- More opportunities for fallbacks when something breaks into havoc
- Well-defined entry points for assets.

The last one is especially important when your app grows.  
While it's achievable to lazy load code and assets with CSR, the bundler will
do a better job with already smaller chunks as a starting point.  
That's what the per-route splitting strategy is providing.

> [!NOTE]  
> For now, the [Gracile CSR add-on](/docs/add-ons/client-router/) is under an experimental phase.  
> It will work with both "Static" and "Server" modes.

## Static mode (SSG)

This is the default output for Gracile the `vite build` phase.

```ts twoslash
// @filename: /vite.config.ts

import { defineConfig } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

export default defineConfig({
  plugins: [
    gracile({
      // TIP: This is the default, no need to set it up!
      output: 'static', // [!code highlight]
    }),
  ],
});
```

With a statically generated output, you'll get access to those context information: `props` and `params`.  
Also, you get the chance to [populate the `props` via `staticPaths`](http://localhost:9899/docs/learn/usage/defining-routes/#doc_staticpaths) for dynamic route paths.

## Server mode

During a server build phase, Gracile will output two distributables: `server` and `client`.

- The `dist/server` folder contains an entry point to consume within your production application.
- The `dist/client` folder contains the static files to serve, without fuss.

The server handler is provided to do upfront work before rendering the page and outputting a `Response`.
Then, you can use it via an adapter with your favorite HTTP server framework.

---

First setup Vite:

```ts twoslash
// @filename: /vite.config.ts

import { defineConfig } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

export default defineConfig({
  plugins: [
    gracile({
      output: 'server', // [!code highlight]
    }),
  ],
});
```

### Supported environments

- **Express**. By far, the most ubiquitous `node:http` based framework.
- **Hono**. A pioneer among frameworks that use the `fetch` standard, while being compatible with a variety of JS runtimes.
- Anything that can provide a `Request` in input and handle back a `Response` or a `node:stream` `Readable`.

The last one is possible by [creating your very own adapter](#doc_creating-an-adapter) for your environment of choice.

> [!NOTE]  
> Under the hood, the Gracile Handler only require a standard `Request` input, and returns a `Response` or a Node's `Readable`.
> The `Readable` is used because there isn't widespread support for the standard **`ReadableStream.from`** method at the moment. Also, for streaming usage, `node:http` can only handle `Readable`s.  
> For now, it would not make sense to do unwanted back and forth convertion, hurting performance for unicity sake.

### Express

This is a working base configuration for Express, see also the [starter project for it](/docs/starter-projects/).

```ts twoslash
// @filename: /server.js

import express from 'express';

import * as gracile from '@gracile/gracile/node';

import { handler } from './dist/server/entrypoint.js';

const app = express();

app.use(express.static(gracile.getClientBuildPath(import.meta.url)));

app.use((req, res, next) => {
  // TIP: The Express adapter will pick-up your locals automatically.
  res.locals.requestId = crypto.randomUUID();
  res.locals.userEmail = req.get('x-forwarded-email') || null;
  return next();
});

app.use(gracile.nodeAdapter(handler)); // [!code highlight]

const server = app.listen(
  3030,
  () => gracile.printUrls(server.address()), // [!code highlight]
);
```

#### Locals with Express

```ts twoslash
// @filename: /src/ambient.d.ts

/// <reference types="@gracile/gracile/ambient" />

declare namespace Gracile {
  interface Locals {
    requestId: import('node:crypto').UUID;
    userEmail: string | null;
  }
}
// TIP: This is how you synchronise both Gracile and Express global Locals!
declare namespace Express {
  // NOTE: You can do it in the other way, too; Gracile extending Express.
  interface Locals extends Gracile.Locals {} // [!code highlight]
}
```

### Hono

This is a working base configuration for Hono, see also the [starter project for it](/docs/starter-projects/).

```ts twoslash
// @filename: /server.js

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

import * as gracile from '@gracile/gracile/hono';

import { handler } from './dist/server/entrypoint.js';

// TIP: This is how you synchronise both Gracile and Hono global Variables!
/** @type {Hono<{ Variables: Gracile.Locals }>} */
const app = new Hono();

app.get(
  '*',
  serveStatic({ root: gracile.getClientBuildPath(import.meta.url) }),
);

app.use((c, next) => {
  // TIP: The Hono adapter will pick-up your locals (called "variables" by Hono) automatically.
  c.set('requestId', crypto.randomUUID());
  c.set('userEmail', 'admin@admin.home.arpa');
  return next();
});

app.use(gracile.honoAdapter(handler)); // [!code highlight]

serve(
  { fetch: app.fetch, port: 3030, hostname: gracile.LOCALHOST },
  (server) => gracile.printUrls(server), // [!code highlight]
);
```

#### Locals with Hono Variables

```ts twoslash
// @filename: /src/ambient.d.ts

/// <reference types="@gracile/gracile/ambient" />

declare namespace Gracile {
  interface Locals {
    requestId: import('node:crypto').UUID;
    userEmail: string | null;
  }
}
```

```ts twoslash
import { Hono } from 'hono';
// ---cut---
// @filename: /server.ts

const app = new Hono<{ Variables: Gracile.Locals }>();

// @filename: /server.js

// TIP: Use JSDoc
/** @type {Hono<{ Variables: Gracile.Locals }>} */
const app = new Hono();
```

### Creating an adapter

You can use Gracile with an HTTP server that works with either Node's own `http` `IncomingMessage`/`ServerResponse` or a framework that supports the standard WHATWG `Request`/`Response` pair.  
Note that Node `Readable` stream API support is required by your JS runtime.

<!--

```ts twoslash
// @filename: /src/ambient.d.ts

import { Readable } from 'node:stream';
import type { GracileHandler } from '@gracile/gracile/server';

export type GracileHonoHandler = (context: {
  req: { raw: Request };
  var: unknown;
}) => Promise<Response>;

export const honoAdapter =
  (handler: GracileHandler): GracileHonoHandler =>
  async (context) => {
    const result = await handler(context.req.raw, context.var);

    if (result instanceof Readable)
      // NOTE: Casting to `ReadableStream` is necessary because the experimental `toWeb` API has mismatches.
      return new Response(Readable.toWeb(result) as ReadableStream, {
        // NOTE: Don.
        headers: { 'Content-Type': 'text/html' },
      });

    if (result) return result;

    throw new Error('Rendering was impossible in the Hono adapter!');
  };
``` -->

For the most straightforward reference, check how the Hono adapter is made under the hood.
It can be a good inspiration for making an adapter for another **WHATWG-friendly** runtime.

Alternatively, for **Koa**, **Fastify** etc., check out Gracile's source code for the `node:http` adapter.
It should be remotely similar to an Express setup, with minor modifications.  
You can then open a PR if you're willing to contribute back to the community.

### Supported deployment environments

Please kindly note that for now, Lit SSR is officially supported on **Node.js**
APIs compatible runtimes, as well as "serverless" **Vercel** functions.  
There is ongoing work for official support across more environments, like
**WinterCG**-compatible runtimes (Deno, Netlify, Cloudflare, Alibaba…) and
possibly more (Bun, Service Workers…).

`ReadableStream` implementations can vary (e.g. `ReadableStream.from` is not available everywhere), but as soon as this API is more stable and featureful as Node's `Readable`, Gracile internals will adopt it for streamlining its rendering phase.

### Static assets (JS, CSS, pre-rendered pages…)

<!-- NOTE: OBSOLETE -->

All you need to do is to serve the `client/dist` from the `/*` route path of your
HTTP framework static assets handler.

Be sure to catch those requests before the Gracile handler kicks in,
like for any other public assets.

Ahead-of-time, **pre-rendered page**s follow the same convention as any static assets.  
The `client/dist/my-route/index.html` with be served to the `/my-route` URL path name.  
<small>See also [prerender in defining routes](/docs/learn/usage/defining-routes/#doc_prerender).</small>

If you have any doubts, see how static assets are handled in the [starter projects](/docs/starter-projects/).

<!-- #### Generate static HTML -->

### Smart caching (advanced)

This is an advanced technique that requires more setup than Gracile owns pre-rendered page, but also offers many more possibilities:

Pre-rendered pages happen once (ahead of time), and it's unaware of the future context from which the request happens.  
With smart caching strategies, you can rely on your infrastructure to handle
this in a dynamic, on-demand way.

Since the 2020s, '"**Stale-While-Revalidate**" and "**Content Cache**" **policies** have become more widespread.  
It's now relatively straightforward to serve cached pages, efficiently with Vercel, Netlify, CloudFlare or Nginx. Remix or Fresh are doing this approach successfully.

<!-- [prefetch on hover/focus](/docs/site-kit/prefetch/)  -->

Also combining prefetch on hover/focus on links can
pre-trigger the necessary work and "revive" expired cache before the user gets
access to the content; if it's quick enough. You could probably shave ~300ms
with this.

#### Nginx web server

[Use `proxy_cache_background_update` with **Nginx**](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_background_update)

This is an example snippet. You should customize it further, like targeting
mostly static routes, where data freshness is not critical (i.e., not on
multi-page forms). And don't forget that response headers may be used too,
for granular and dynamic control.

```nginx
proxy_cache_key $scheme://$host$uri$is_args$query_string;
proxy_cache_valid 200 10m;
proxy_cache_bypass $arg_should_bypass_cache_xyz1234;
proxy_cache_use_stale updating error timeout http_500 http_502 http_503 http_504 http_429;
proxy_cache_lock on;
proxy_cache_background_update on;
```

#### "Serverless" platforms

- [**Cloudflare** Cache Control revalidation](https://developers.cloudflare.com/cache/concepts/cache-control/#revalidation)
- [**Netlify**'s SWR](https://www.netlify.com/blog/swr-and-fine-grained-cache-control/)
- [**Vercel**'s SWR](https://vercel.com/docs/edge-network/caching)
