# CSS helpers

Custom Elements with Shadow DOM, sometimes, are too hermetic, style-wise. These
helpers make one or many sheets adoptable, with no FOUC.

[Adoptable stylesheets](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets)
offer a modular way to share CSS between your HTML Custom Elements and/or the
light DOM.  
However, due to their relative recency, and missing browser features, there is
still some gaps to fill.

Gracile aims to align with available web standard discussions, which is possible
thanks to it's underlying bundler: Vite.  
The build step offers us a way to experiment proof of concepts for their
viability in the field.

> [!CAUTION] Experimental. This is not well tested, nor it is customizable
> enough.

Actually, this package provides two helpers:

**1. Adoptable global styles**

For adopting every light-dom stylesheets (those referenced via a `<link>`) in a
given shadow root.

Goal is to ease loading your own ubiquitous styles, but also for vendored CSS
frameworks (Bootstrap, Tailwind…).

Note that, by design, Vite is bundling `<link>`

This helper is an interpretation of the
["Open stylable" idea](https://github.com/WICG/webcomponents/issues/909).

**2. Declarative shadow DOM style sharing**

Allows cherry-picking specific stylesheets for a given shadow root, all while in
an SSR'ed context.

Inspired by the first implementation of this
[explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/ShadowDOM/explainer.md).

This method doesn't use externally loaded stylesheets (via `<link>`), but a
special kind of `<script type="css-module">` with inline CSS.  
That allows the Declarative Shadow DOM to be rendered as fast as possible
without any flash of un-styled content.

This is a good step toward reducing duplicated inline `<style>` that you will
typically see with Lit SSR, and which is kind of the go-to method for a nice CEs
DSD rendition, until something better emerges.

## Installation

```sh
npm i @gracile-labs/css-helpers
```

## Usage

See the
[Minimal Bootstrap/Tailwind template](https://github.com/gracile-web/starter-projects/tree/main/templates/minimal-bootstrap-tailwind)
for a full working example.

After installing the `@gracile-labs/css-helpers`, you will first have to setup
the document where you want them to take effect:

```ts
// @filename: ./src/document.ts

import { html } from '@gracile/gracile/server-html';
import { AdoptableStylesProvider } from '@gracile-labs/css-helpers/declarative-adoptable';
import { GlobalStylesProvider } from '@gracile-labs/css-helpers/global-css-provider';

// NOTE: Loading with `.css?inline` is the typical way to construct stylesheets with Vite.
import adopted1 from './features/adopted-1.css?inline';
import adopted2 from './features/adopted-2.css?inline';

export const document = () => html`
  <!doctype html>
  <html lang="en">
    <head>
      <!-- ... -->

      <!-- NOTE: 1. Adoptable global styles -->
      <link
        rel="stylesheet"
        href=${new URL('./document.css', import.meta.url).pathname}
      />
      <link rel="stylesheet" href="..." />
      ${GlobalStylesProvider()}

      <!-- NOTE: 2. Declarative shadow DOM style sharing -->
      <script type="css-module" specifier="/adopted-1.css">
        ${adopted1}
      </script>
      <script type="css-module" specifier="/adopted-2.css">
        ${adopted2}
      </script>
      ${AdoptableStylesProvider()}
    </head>

    <body>
      <route-template-outlet></route-template-outlet>
    </body>
  </html>
`;
```

Then, you can consume **global** or **single** sheets for any given custom
element:

```ts
// @filename: ./src/features/my-greetings-adopted.ts

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-greetings-adopted')
export class MyGreetingsAdopted extends LitElement {
  @property() name = 'World';

  render() {
    return html`
      <adopted-style sheets="/adopted-1.css, /adopted-2.css"></adopted-style>
      <h1>Hello</h1>
      <button>${this.name}</button>
    `;
  }
}
```

The `<adopted-style sheets="/foo.css, /bar.css"></adopted-style>` or
`<adopt-global-styles></adopt-global-styles>` elements must be defined before
any other HTML content in the host root.
