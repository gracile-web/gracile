# Passing data from server to client

When you output Web Components from the server, with or without the declarative shadow DOM pre-render, it's often desirable to initialize them with server-generated, complex data.

Instead of reinventing the wheel, Gracile is just providing you the guidelines on how to achieve that, well… gracefully 😌.

Note that this isn't even a JS framework thing. The patterns described below are transposable for any HTML-outputting backends.

Typically you'll find two philosophies:

1. Put the hydrating data in a `<script type="application/json">{...}</script>`, and from there the client-side framework will pick that up to hydrate the component tree by reconciling it with data.  
   **Examples**: Nuxt, Next, Gatsby…
2. Put the hydrating data in a child element attribute, typically called an "Island".  
   **Examples**: Astro, Fresh,…

With Lit SSR you can use both methods, though. The first one is [described here](https://github.com/lit/lit/tree/main/packages/labs/ssr#server-only-templates).  
In this mini-guide, we'll focus on the "Island-ey" pattern, for now.

## Custom Element examples

<!-- TODO: update assets entrypoints pattern (put in sibling client) -->

```ts twoslash
// @filename: /src/features/my-partial.ts

import { html } from 'lit';

// NOTE: Will handle server rendering just fine as well!
import './my-lit-element.js';
import type { InitialData } from './my-lit-element.js';

export type InitialData = { foo?: string; baz?: null | number };

const data = { foo: 'bar', baz: 2 } satisfies InitialData;

export const myServerRenderedPartial = html`
  <!-- ... -->
  <section>
    <my-lit-element initialData=${JSON.stringify(data)}></my-lit-element>
  </section>
  <section>
    <my-bare-element data-initial=${JSON.stringify(data)}></my-bare-element>
  </section>
  <!-- ... -->
`;

// @filename: /src/features/my-partial.client.ts

import './my-lit-element.ts';
import './my-bare-element.ts';

// @filename: /src/features/my-lit-element.ts

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { InitialData } from './my-partial.ts';

@customElement('my-lit-element')
export class MyLitElement extends LitElement {
  @property({ type: Object })
  initialData: InitialData | string = {};

  render() {
    if (typeof this.initialData !== 'object') return html`Invalid data`;

    return html`
      <!-- -->
      <div>${this.initialData.foo}</div>
      <div>${this.initialData.baz || 'Oh no'}</div>
    `;
  }
}

// @filename: /src/features/my-bare-element.js

import type { InitialData } from './my-partial.ts';

class MyBareElement extends HTMLElement {
  #initialData?: InitialData;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const attrData = this.dataset.initial;
    if (attrData) this.#initialData = JSON.parse(attrData);

    this.shadowRoot!.innerHTML = `
        <div>${this.#initialData?.foo || 'Not defined!'}</div>
        <div>${this.#initialData?.baz || 'Not defined!'}</div>
      `;
  }
}
customElements.define('my-bare-element', MyBareElement);
```

Another big win by leveraging Web Component intrinsic versatility!  
No need to bring superfluous JS kilobytes to do this hard work, it's already
embedded in your browser.

Please note that these examples could be improved, notably for:

```js
initialData: InitialData | string = {};
```

`string` is just for the [`ts-lit-plugin`](/docs/developer-experience/#doc_lit-analyzer) to be appeased inside the `html` template.  
Also, `initialData` and `initialdata` are equivalent, but hyphenated properties are rejected by the linter.

Maybe a bit more elegant solutions could be achieved, but those a more convention/typing issues, not runtime ones.

<!-- > [!NOTE]
> It's possible to achieve the same thing with bare web components, too.
> You'll  -->

## Advanced serialization / deserialization

If you want to pass more complex data like object with self referencing children,
dates, and more, you can use a dedicated library for that, there are plenty.

For example the excellent [Seroval](https://github.com/lxsmnsyc/seroval) library can be used in conjunction with a Lit [`@property` custom converter](https://lit.dev/docs/components/properties/#conversion-converter) to properly "revive" the serialized data.

This is a fully working example:

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';

export const document = (props: { url: URL }) => html`...`;
//---cut---

// @filename: /src/routes/serialization.ts

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';
import { serialize } from 'seroval';

import { document } from '../document.js';
import { complexData } from './_serialization-demo-data.js';

export default defineRoute({
  document: (context) => document(context),

  template: () => html`
    <serialization-example
      myComplexData=${serialize(complexData)}
    ></serialization-example>
  `,
});

// @filename: /src/routes/_serialization-demo-data.ts

export const complexData = {
  number: [Math.random(), -0, NaN, Infinity, -Infinity],
  string: ['hello world', '<script>Hello World</script>'],
  boolean: [true, false],
  null: null,
  undefined: undefined,
  bigint: 9007199254740991n,
  array: [, , ,], // holes
  regexp: /[a-z0-9]+/i,
  date: new Date(),
  map: new Map([['hello', 'world']]),
  set: new Set(['hello', 'world']),
} as const;

export type MyData = typeof complexData;

// self cyclic references
// recursive objects
complexData.self = complexData;
// recursive arrays
complexData.array.push(complexData.array);
// recursive maps
complexData.map.set('self', complexData.map);
// recursive sets
complexData.set.add(complexData.set);

// mutual cyclic references
complexData.array.push(complexData.map);
complexData.map.set('mutual', complexData.set);
complexData.set.add(complexData.array);

// @filename: /src/routes/serialization.client.ts

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { serialize, deserialize } from 'seroval';

import type { MyData } from './_serialization-demo-data.js';

@customElement('serialization-example')
export class SerializationExample extends LitElement {
  @property({
    converter: {
      fromAttribute: (value) =>
        value ? deserialize<MyData>(value) : undefined,
    },
  })
  // NOTE: Reminder that `string` is used to prevent a type error in the template.
  myComplexData?: MyData | string;

  render() {
    if (typeof this.myComplexData !== 'object') return html`Invalid data`;

    return html`
      <span>Dump</span>
      <pre>${serialize(this.myComplexData)}</pre>

      <!--  -->

      ${this.myComplexData.map.size}

      <!--  -->

      ${this.myComplexData.date.getFullYear()}

      <!--  -->

      ${this.myComplexData.regexp.test('Regexp test string')}
    `;
  }
}
```

## Refreshing data without a full page reload

For that, just set up a [JSON handler](/docs/learn/usage/defining-routes/#doc_handler-experimental) in your route.
Then, connect this pipe to your Web Components properties and interactions.  
Could be bidirectional, too (`GET`/`POST` → `Response`).
