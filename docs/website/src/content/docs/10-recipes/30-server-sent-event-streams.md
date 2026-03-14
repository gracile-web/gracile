# Server-Sent Events manipulation

SSE are a powerful way to retrieve real-time data streams from the server to your
client.

As Gracile relies on standard the `Response` API, you can use a `ReadableStream`
for the `body` to use.  
Implement your underlying source for your custom streamer, set the correct `content-type`
to `text/event-stream`, and you're good to use [Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)!

Here is how to achieve that within Gracile, in only 3 steps, with this full-stack implementation.

---

Basic project layout for this demo:

<div class="file-tree">

- my-project/
  - src/
    - ...
    - routes/
      - server-events.ts _- The endpoint that send a stream back_.
      - streams.client.ts _- Where we put the client-only custom element_.
      - streams.ts _- The page for testing SSE in the browser_.
  - ...

</div>

## 1. Define a route and a client view

Nothing outstanding here.  
As usual, we define a route, here `/streams/`, with
a very basic HTML `template`.

In this template, we'll embed a `<simple-event-sourcer>`, client-only custom element,
that we will define later.

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';
export const document = () => html` ... `;
// ---cut---
// @filename: /src/routes/streams.ts

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';

export default defineRoute({
  document: (context) => document({ ...context, title: 'Streams' }),

  template: () => html`
    <main>
      <p>Let the stream flow!</p>

      <hr />

      <simple-event-sourcer>
        <pre>
Dump…
---------------------------------------------------------
</pre
        >
      </simple-event-sourcer>
    </main>
  `,
});
```

## 2. Create a stream reader custom element

In the sibling `streams.client.ts` file, we'll' define our vanilla custom element.

The [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
browser API is the key part here.

```ts twoslash
// @filename: /src/routes/streams.client.ts

const eventSourceUrl = '/server-events/';

customElements.define(
  'simple-event-sourcer',
  class extends HTMLElement {
    // NOTE: This is a standard, globally available API!
    #eventSource = new EventSource(eventSourceUrl); // [!code highlight]

    #dump = this.querySelector('pre')!;

    connectedCallback() {
      this.#eventSource.addEventListener('open', (event) => {
        console.log(event);
      });

      this.#eventSource.addEventListener('message', (event) => {
        console.log(event);

        this.dump(event);
      });
    }

    dump(event: Event) {
      if (('data' in event && typeof event.data === 'string') === false)
        throw new Error('Incorrect stream!');

      this.#dump.append(
        (document.createElement('code').innerHTML = `${event.data}\n`),
      );
    }
  },
);
```

## 3. Create a server-sent events endpoint

Finally, here is the real meat, the server endpoint that will output our event stream.

It's a very trivial implementation with a cyclic timer that outputs a ping message.

We are defining the "underlying source" for the `ReadableStream`, so we can control
what data it will provide for our HTTP response body.

```ts twoslash
// @filename: /src/routes/server-events.ts

import { defineRoute } from '@gracile/gracile/route';

// TIP: Just a small helper for formatting `EventSource` data chunk.
function enqueue(
  controller: ReadableStreamDefaultController<string>,
  data: string,
) {
  return controller.enqueue(`data: ${data}\n\n`);
}

const INTERVAL_MS = 1000;

export default defineRoute({
  handler: () => {
    let intervalId: ReturnType<typeof setInterval>;
    // [!code highlight:3]
    const body = new ReadableStream<string>({
      start(controller) {
        enqueue(controller, 'Hello World!');

        // NOTE: Do the work here.
        intervalId = setInterval(() => {
          const data = `— Ping! — ${new Date().toISOString()} —`;

          enqueue(controller, data); // [!code highlight]
        }, INTERVAL_MS);

        // TIP: Could react to external events and send messages from here.
        // myExternalEventTarget.addEventListener(…)
      },

      cancel: () => clearInterval(intervalId), // [!code highlight]
    });

    return new Response(body, {
      headers: { 'content-type': 'text/event-stream' },
    });
  },
});
```

Event source needs to receive chunks with the `data: (.*)\n\n` format to be understood.
That's why we can wrap this in a tiny helper to not mess this up, with proper validation etc.,
especially if it's getting used in multiple places.

---

To go further, you could replace this dumb, intervalled stream with something that
reacts to internal server events, to forward them.  
`EventTarget` is a good fit for this. It's available in Node, Deno, etc., and browsers of course!

See also [Fetch Event Source](https://github.com/Azure/fetch-event-source), a library that brings "A better API for making Event Source requests, with all the features of `fetch()`".
