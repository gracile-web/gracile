# Routing within a single endpoint

Gracile doesn't aim to replace full-fledged HTTP frameworks like Express, Hono, Elysia, Fastify, etc.  
However, you might want to colocate JSON endpoints with your front-end, to achieve what is often called the "Back-For-Front" pattern.  
It's when you want to put a thin bridge whose role is to authenticate with and curate your "real" backends.

That being said, Gracile is full-stack but is leaning more on the front-end side.
This is perfect for the typical scenario where "serverless" is chosen (aka more or less custom JS runtime running near the user).  
But it is also a good practice to not put too much processing weight on the _rendering_ side of your app/site, whether it is server-rendered upfront, or not.

Single entry point API routes can also be used to set up OpenAPI driven handlers, GraphQL, tRPC…  
But we will stick with pure JSON here.

Note that when possible, it's clearer to keep a file-based routing, like `/api/pet/[id].ts`, but sometimes it's more maintainable to use programmatic routing in a single file.  
For that, we can use a `[...rest].ts` "catch-all" route and process the URL forward ourselves.

## Pre-requisites

In this recipe, we will explore the `URLPattern` API to help us with **routing**.  
At the time this guide
is written, [isn't supported widely](https://caniuse.com/mdn-api_urlpattern), whether on server runtimes or browsers.

<!-- NOTE: Feature not found -->
<!-- <caniuse-embed feature="mdn-api_urlpattern" periods="future_1,current,past_1,past_2"></caniuse-embed>

<div class="git-only">

[**URLPattern API** on caniuse.com](https://caniuse.com/mdn-api_urlpattern)

</div> -->

Fortunately, there is a polyfill available, which is the one used under the hood
by Gracile already to achieve file-based routing.

```sh
npm i urlpattern-polyfill
```

## Files

Here is a very contrived example, from where you can elaborate with `POST`, more `URLPattern`,
hand-shakes and data sourcing from/to your back-ends…

Defining more route patterns for your single-file API entry point will start to make sense over just using the file-based routing.
(Like already said above, `/api/pet/:id/` could already be defined in the Gracile file router with `/api/pet/[id].ts`).

But we just want to demonstrate the basic primitives for now:

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';
export const document = () => html` ... `;
// ---cut---
// @filename: /src/routes/api/[...path].ts

import { defineRoute } from '@gracile/gracile/route';
// NOTE: Usually defined as a global in the browser.
import { URLPattern } from 'urlpattern-polyfill';

const petDb = [
  { id: 1, name: 'Rantanplan', type: 'dog' },
  { id: 1, name: 'Felix', type: 'cat' },
];

const petStorePattern = new URLPattern(
  '/api/pet/:id/',
  'http://localhost:9898/',
);

export default defineRoute({
  handler: (context) => {
    if (context.request.method !== 'GET')
      return Response.json(
        { success: false, message: `Only "GET" is allowed.` },
        { status: 405 },
      );

    const result = petStorePattern.exec(context.url);

    const id = result?.pathname.groups?.id;
    if (!Number.isNaN(id)) {
      const foundPet = petDb.find((pet) => pet.id === Number(id));

      if (foundPet) return Response.json({ success: true, data: foundPet });

      return Response.json(
        { success: false, message: `Pet "${id}" not found!` },
        { status: 404 },
      );
    }

    return Response.json(
      { success: false, message: `Unknown API route for "${context.url}"` },
      { status: 400 },
    );
  },
});

// @filename: /src/routes/my-api-consumer.ts

import { html } from 'lit';
import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.js';

export default defineRoute({
  document: (context) => document(context),

  template: () => html`
    <script type="module">
      const pet = await fetch('/api/pet/1/').then((r) => r.json());
      const noPet = await fetch('/api/pet/10/').then((r) => r.json());
      const wrongMethod = await fetch('/api/pet/1/', {
        method: 'DELETE',
      }).then((r) => r.json());

      console.log({ pet, noPet, wrongMethod });
    </script>

    <h1>My JSON API consumer</h1>
  `,
});
```
