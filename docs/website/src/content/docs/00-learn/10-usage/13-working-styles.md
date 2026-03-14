# <i-c o='ph:palette-duotone'></i-c>Working with styles

CSS is an indispensable piece of tech. for making your website pleasurable, and accessible. Working with stylesheets should be made easy, too.

Hopefully, Gracile is leveraging Vite features in this area: pre or post-processors, bundling, etc.

Styles, overall, are still a contentious topic in the front-end development space, with
many different (and often incompatible ways) to consume, scope and distribute them. All that with SSR compatibility in mind.  
Hopefully, things will get better with CSS `@scope`, "Open-Stylables" or standard
CSS modules, just to name a few possible paths of resolution.

In the meantime, we will see how to achieve that with web platform standards
in mind with what we have at hand.

---

Be sure to take a read at [Working with assets](/docs/learn/usage/working-with-assets/) before taking the plunge here.

## Client or Server import in JS module

While Vite-based frameworks often allow importing CSS from a route or
client code like this:

```ts twoslash
// @filename: /src/document.ts
import { html } from '@gracile/gracile/server-html';
export const document = () => html` ... `;
// ---cut---
// @filename: /src/routes/demo.ts

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

// CAUTION: We are inside a server module, imported CSS here is ignored!
import './my-styles-foo.css';

export default defineRoute({
  document: (context) => document(context),

  template: () => html`
    <h1>Wow</h1>
    <!--  -->
  `,
});

// @filename: /src/routes/demo.client.ts

// WARNING: We are inside a client module, imported CSS here will work but is not recommended!
import './my-styles-bar.css';
```

**This is not standard**!

Behind the scenes, **a lot of stuff** has to happen at the bundler level to achieve this kind of UX. Sadly, that can produce unexpected CSS ordering, which
is a widely known issue, even with Webpack.

While this adds a bit of comfort, you should just **import CSS in CSS** (with the `@import` standard at-rule), and have a total, predictable control.

Ultimately, establish your CSS entry points at the **document** or **page template** level, in the **HTML** itself.  
You do that using the good old and [reliable `<link>` tag](/docs/learn/usage/working-with-assets/#doc_1-globally-at-the-document-level).

## Pre/post-processors

Gracile supports every [Vite's features regarding CSS](https://vitejs.dev/guide/features#css).

## Adopted Stylesheets

`CSSStyleSheet`, "**Standard CSS Modules**" and "**Adopted Stylesheets**" are new standards working together allowing to import CSS like JavaScript modules, meaning they're dynamic, take part of the module graph…

It's particularly useful for building Custom Elements with a Shadow Root, from which you can adopt them.  
It's not reserved to Custom Elements, it also works for the global `document` object (meaning global Light-DOM styling), and any kind of detached `<template>` Shadow Root, too.

We will use the `?inline` import query parameter for our examples.

> [!CAUTION]  
> `?inline` etc. are **non-standard**, and as soon as Vite support
> **Import Attributes** (`with { type: 'css' }`) this stop-gap will be superseeded.

### Adopt from a Custom Element

```ts twoslash
// @filename: /src/vanilla-element.ts

import stylesText from './vanilla-element.css?inline';
// NOTE: or SCSS, Less, etc.

const styles = await new CSSStyleSheet().replace('stylesText');

export class MyVanillaCounter extends HTMLElement {
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.adoptedStyleSheets = [styles];

    shadow.innerHTML = `<h1>Wow</h1>`;
  }
}
```

### Adopt from a Lit Element

> [!IMPORTANT]  
> This will NOT work with **SSR**.  
> `CSSStyleSheet` doesn't exist in Node.

```ts twoslash
// @filename: /src/my-lit-element.ts

import { html, css, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './my-lit-element.css?inline';

const styles = await new CSSStyleSheet().replace('stylesText');

// NOTE: or SCSS, Less, etc.

@customElement('my-lit-element')
export class MyLitElement extends LitElement {
  render() {
    return html`<h1>Wow</h1>`;
  }

  static styles = [styles];
}
```

For **SSR + Client** usage, we still have to use Lit's own `CSSResult` like this:

```ts twoslash
// @filename: /src/my-lit-element-ssr.ts

import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './my-lit-element-ssr.css?inline';

@customElement('my-lit-element-ssr')
export class MyLitElementSsr extends LitElement {
  render() {
    return html`<h1>Wow</h1>`;
  }

  static styles = [unsafeCSS(styles)];
}
```

Of course, you can just use, for example, a `my-styles.css.ts` (or `my-styles.styles.ts`) exporting a Lit `css`, instead of using pure CSS + `?inline` + `unsafeCSS`. E.g:

```ts twoslash
// @filename: /src/my-lit-element.styles.ts

import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    color: var(--color-red-600, tomato);
  }
`;

// @filename: /src/my-lit-element.ts

import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles } from './my-lit-element.styles.js';

@customElement('my-lit-element')
export class MyLitElement extends LitElement {
  render() {
    return html`<h1>Wow</h1>`;
  }

  static styles = [styles];
}
```

But please note that, in nearly all cases, tooling works better within their original environment (editor hints, linters, processors…), in this case, a `.css` file.

Composite files make tooling exponentially buggy.

### Adopt in the global document

We will use `replaceSync` this time, to show off.  
`replace` needs an await (not always possible at the top level), but has the benefit of returning the instance (chainable).

```ts twoslash
// @filename: /src/document.client.ts

import globalAdoptedStylesText from './global-adopted.css?inline';

const globalAdoptedStyles = new CSSStyleSheet();
globalAdoptedStyles.replaceSync(globalAdoptedStylesText);

document.adoptedStylesheets = [globalAdoptedStyles];
```

### Adopt in a Template HTML element

This is kind of a fringe usage, but, hey, it's possible!

```ts twoslash
// @filename: /src/features/template-demo.ts

import templateStylesText from './template-demo.css?inline';

const templateStyles = new CSSStyleSheet();
templateStyles.replaceSync(templateStylesText);

const template = document.querySelector<HTMLTemplateElement>(
  'template#my-template',
);

template.shadowRoot.adoptedStylesheets = [templateStyles];
```
