# 🧚 Gracile

A thin, full-stack, **web** framework.

Features:

- Portable **HTML**, **CSS** and **JS**, thanks to **Lit (SSR)**.
- Highly responsive during dev. and build, thanks to **Vite**.
- **Minimal dependency footprint** for its **runtime** and your
  **distributable**.
- Embrace web standards like **Custom Elements** (aka Web Components) or the
  **WhatWG Fetch** API.
- A streamlined **D**eveloper e**X**perience for building, instead of fiddling
  around.

# 🏁 Get Started

Bootstrap a project with the `create gracile@latest` command:

```
npm create gracile@latest
pnpm create gracile@latest
bun create gracile@latest
yarn create gracile@latest
```

For more information, head over to the
[documentation website (gracile.js.org)](https://gracile.js.org/).

## 🌐 A platform-minded meta-framework

Gracile is powered by **Vite** and **Lit SSR**.

With it, you can achieve:

- File-based routing with efficient code-splitting
- **S**erver **S**ide **R**endering
- **S**tatic **S**ite **G**eneration
- **Server** integration (`Request`/`Response`) for **Express**, **Hono**…
- Full-stack **Custom Elements** (Lit), with hydration
- **Content** websites
- Multi or Single Page **Applications**
- Progressive enhancements (no JS fallbacks, smart hydration…)
- And more, via **Add-ons** (Markdown, Metadata, SVG…)

All that, with a **few conventions**, a **standard-oriented** approach and a
very **contained footprint** 🤏.

Web Components, TypeScript, SASS, Lit, and other DX perks are all at your
fingertips; while remaining optional.

Thanks to the Vite modular architecture, and Node.js versatility, **developer
experience** is smoothed up across the board, while in **development** and when
building for **production**.

## Ease of use

Write the same markup, styling and scripting languages for both server and
client side.  
The ones that you already know and use everywhere else: **HTML**, **CSS** and
**JavaScript**.

Simplicity doesn't mean obfuscation. You're still in charge without abandoning
flexibility to your framework.

## Standards oriented

Built with a platform-minded philosophy. Every time a standard can be leveraged
for a task, it should be.  
It also means fewer vendor-specific idioms to churn on and a more portable
codebase overall.  
Stop re-implementing the wheel, and embrace **future-proof APIs**, you'll thank
yourself later!

## Developer Experience

The DX bar has been constantly raised, alongside developers' expectations about
their everyday tooling.  
The "Vanilla" community is full of gems, in a scattered way.  
Gracile provides an integrated, **out-of-the-box** experience while keeping
non-core opinions as _opt-ins_.

## Convention over configuration

Finding the right balance between **convenience** and **freedom** is tricky.  
Hopefully, more and more patterns will be established in the full-stack JS
space.

Gracile is inspired by those widespread practices that will make you feel at
home.

## Light and unobtrusive

All in all, the Gracile framework is just Vite, Lit SSR and a very **restricted
set of helpers and third parties**.  
Check its
[dependency tree on npmgraph](https://npmgraph.js.org/?q=@gracile/gracile),
you'll see by yourself.  
Also, everything is done to **keep your Vite configuration as pristine as
possible**. Augmenting an existing project can be done in a pinch, with no
interference.

## Performances

**Speed is not the main goal** for Gracile, that's because it is just the sane
default you'll start with.  
Avoiding complex template transformations, or surgically shipping client-side JS
are just a few facets of what makes Gracile a "_do more with less_" power tool.

## Packages

### Core

|                                                                                                                | Package                                         | Description                                   |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| [![npm](https://img.shields.io/npm/v/@gracile/gracile?label=)](https://www.npmjs.com/package/@gracile/gracile) | [**@gracile/gracile**](./packages/gracile)      | Full-stack web framework — Vite & Lit SSR     |
| [![npm](https://img.shields.io/npm/v/@gracile/engine?label=)](https://www.npmjs.com/package/@gracile/engine)   | [**@gracile/engine**](./packages/engine)        | Vite-powered build and dev server engine      |
| [![npm](https://img.shields.io/npm/v/@gracile/server?label=)](https://www.npmjs.com/package/@gracile/server)   | [**@gracile/server**](./packages/server)        | Server-side utilities and SSR helpers         |
| [![npm](https://img.shields.io/npm/v/@gracile/client?label=)](https://www.npmjs.com/package/@gracile/client)   | [**@gracile/client**](./packages/client)        | Client-side utilities and interactive helpers |
| [![npm](https://img.shields.io/npm/v/@gracile/cli?label=)](https://www.npmjs.com/package/@gracile/cli)         | [**@gracile/cli**](./packages/cli)              | CLI and configuration loader                  |
| [![npm](https://img.shields.io/npm/v/create-gracile?label=)](https://www.npmjs.com/package/create-gracile)     | [**create-gracile**](./packages/create-gracile) | Project scaffolder (`npm create gracile`)     |

### Add-ons

|                                                                                                                                              | Package                                                                         | Description                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| [![npm](https://img.shields.io/npm/v/@gracile/markdown?label=)](https://www.npmjs.com/package/@gracile/markdown)                             | [**@gracile/markdown**](./packages/addons/markdown)                             | Markdown file import with metadata extraction |
| [![npm](https://img.shields.io/npm/v/@gracile/markdown-preset-marked?label=)](https://www.npmjs.com/package/@gracile/markdown-preset-marked) | [**@gracile/markdown-preset-marked**](./packages/addons/markdown-preset-marked) | Markdown preset using Marked                  |
| [![npm](https://img.shields.io/npm/v/@gracile/metadata?label=)](https://www.npmjs.com/package/@gracile/metadata)                             | [**@gracile/metadata**](./packages/addons/metadata)                             | Page head metadata helper (title, OG…)        |
| [![npm](https://img.shields.io/npm/v/@gracile/sitemap?label=)](https://www.npmjs.com/package/@gracile/sitemap)                               | [**@gracile/sitemap**](./packages/addons/sitemap)                               | Sitemap and robots.txt generation             |
| [![npm](https://img.shields.io/npm/v/@gracile/svg?label=)](https://www.npmjs.com/package/@gracile/svg)                                       | [**@gracile/svg**](./packages/addons/svg)                                       | SVG import, optimization and inlining         |

### Labs (`@gracile-labs`)

|                                                                                                                                      | Package                                            | Description                                         |
| ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | --------------------------------------------------- |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/client-router?label=)](https://www.npmjs.com/package/@gracile-labs/client-router) | [**client-router**](./packages/labs/client-router) | Client-side routing for Gracile pages               |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/islands?label=)](https://www.npmjs.com/package/@gracile-labs/islands)             | [**islands**](./packages/labs/islands)             | Islands architecture with multi-framework hydration |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/hmr?label=)](https://www.npmjs.com/package/@gracile-labs/hmr)                     | [**hmr**](./packages/labs/hmr)                     | Web Components HMR Vite plugin                      |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/css-helpers?label=)](https://www.npmjs.com/package/@gracile-labs/css-helpers)     | [**css-helpers**](./packages/labs/css-helpers)     | Adopted stylesheets utilities for web components    |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/better-errors?label=)](https://www.npmjs.com/package/@gracile-labs/better-errors) | [**better-errors**](./packages/labs/better-errors) | Enhanced error display and formatting               |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/functional?label=)](https://www.npmjs.com/package/@gracile-labs/functional)       | [**functional**](./packages/labs/functional)       | Signal-based hooks and context primitives           |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/devtools?label=)](https://www.npmjs.com/package/@gracile-labs/devtools)           | [**devtools**](./packages/labs/devtools)           | In-browser dev panel for routes and state           |

### Labs — JSX & Templates

|                                                                                                                                                                              | Package                                                                                    | Description                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| [![npm](https://img.shields.io/npm/v/jsx-forge?label=)](https://www.npmjs.com/package/jsx-forge)                                                                             | [**jsx-forge**](./packages/labs/jsx-forge)                                                 | Native TS compiler: JSX to HTML template literals |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/vite-plugin-jsx-forge?label=)](https://www.npmjs.com/package/@gracile-labs/vite-plugin-jsx-forge)                         | [**vite-plugin-jsx-forge**](./packages/labs/vite-plugin-jsx-forge)                         | Vite plugin for JSX Forge                         |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/babel-plugin-jsx-to-literals?label=)](https://www.npmjs.com/package/@gracile-labs/babel-plugin-jsx-to-literals)           | [**babel-plugin-jsx-to-literals**](./packages/labs/babel-plugin-jsx-to-literals)           | Babel plugin: JSX to HTML template literals       |
| [![npm](https://img.shields.io/npm/v/@gracile-labs/vite-plugin-babel-jsx-to-literals?label=)](https://www.npmjs.com/package/@gracile-labs/vite-plugin-babel-jsx-to-literals) | [**vite-plugin-babel-jsx-to-literals**](./packages/labs/vite-plugin-babel-jsx-to-literals) | Vite wrapper for JSX→Literals Babel plugin        |

### Labs — Literals (`@literals`)

|                                                                                                                                                                  | Package                                                                                         | Description                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [![npm](https://img.shields.io/npm/v/@literals/html-css-minifier?label=)](https://www.npmjs.com/package/@literals/html-css-minifier)                             | [**html-css-minifier**](./packages/labs/literals/html-css-minifier)                             | Minify HTML template literal strings        |
| [![npm](https://img.shields.io/npm/v/@literals/rollup-plugin-html-css-minifier?label=)](https://www.npmjs.com/package/@literals/rollup-plugin-html-css-minifier) | [**rollup-plugin-html-css-minifier**](./packages/labs/literals/rollup-plugin-html-css-minifier) | Rollup plugin for HTML literal minification |
| [![npm](https://img.shields.io/npm/v/@literals/parser?label=)](https://www.npmjs.com/package/@literals/parser)                                                   | [**parser**](./packages/labs/literals/parser)                                                   | Parse template literals from code           |

### Labs — Standalone tools

|                                                                                                                                                | Package                                                                                  | Description                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [![npm](https://img.shields.io/npm/v/og-images-generator?label=)](https://www.npmjs.com/package/og-images-generator)                           | [**og-images-generator**](./packages/labs/og-images-generator)                           | OG image generator from HTML (no headless browser) |
| [![npm](https://img.shields.io/npm/v/vite-plugin-standard-css-modules?label=)](https://www.npmjs.com/package/vite-plugin-standard-css-modules) | [**vite-plugin-standard-css-modules**](./packages/labs/vite-plugin-standard-css-modules) | CSS modules via import attributes in Vite          |

### Internal

|                                                                                                                                      | Package                                                          | Description                             |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------- |
| [![npm](https://img.shields.io/npm/v/@gracile/internal-tsconfigs?label=)](https://www.npmjs.com/package/@gracile/internal-tsconfigs) | [**@gracile/internal-tsconfigs**](./packages/internal/tsconfigs) | Shared TypeScript configuration presets |
| [![npm](https://img.shields.io/npm/v/@gracile/internal-utils?label=)](https://www.npmjs.com/package/@gracile/internal-utils)         | [**@gracile/internal-utils**](./packages/internal/utils)         | Shared monorepo utilities               |

## 👐 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

- [Documentation website (gracile.js.org)](https://gracile.js.org/)
- [Documentation website repository](https://github.com/gracile-web/website)
- [Starter projects repository](https://github.com/gracile-web/starter-projects)

---

> “Perfection is achieved, not when there is nothing more to add, but when there
> is nothing left to take away.”
>
> ―
> [Antoine de Saint-Exupéry](https://en.wikipedia.org/wiki/Antoine_de_Saint-Exup%C3%A9ry),
> _Airman's Odyssey_
