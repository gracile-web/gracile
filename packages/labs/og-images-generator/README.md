# Open Graph Images Generator <!-- omit in toc -->

[![NPM](https://img.shields.io/npm/v/og-images-generator)](https://www.npmjs.com/package/og-images-generator)
![Downloads](https://img.shields.io/npm/dt/og-images-generator)
[![ISC License](https://img.shields.io/npm/l/og-images-generator)](./LICENSE)
[![GitHub](https://img.shields.io/badge/Repository-222222?logo=github)](https://github.com/JulianCataldo/og-images-generator)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://makeapullrequest.com) \
[![TypeScript](https://img.shields.io/badge/TypeScript-333333?logo=typescript)](http://www.typescriptlang.org/)
[![Prettier](https://img.shields.io/badge/Prettier-333333?logo=prettier)](https://prettier.io)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333?logo=editorconfig)](https://editorconfig.org)

Generate social sharing thumbnails for your websites, with plain **HTML** + **CSS** templates. \
Extract metadata from pages, on-the-fly (middleware) or from distributable (static folder).

**No headless browser** involved = fast cold boot, much less MBs. \
Exposes all underlying APIs for full output customization.

Usable as a **CLI**, an **API** or via **plugins** for **Astro**, **Express**, **Rollup**, **Vite** and **Web Dev Server**.

Moreover, a handful of **helpers** + **hot module reloading** are here to ease poster image authoring.

Under the hood, it will transform your HTML / CSS to **SVG**, while **retaining layout and typography calculations**, then it's converted to **PNG**. \
You can use gradients, borders, flexboxes, inline SVGs, and [more](https://github.com/vercel/satori)…

---

<div > 
<div align="center">Table of Contents</div>

- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [Programmatic (JS API)](#programmatic-js-api)
  - [Express / Connect middleware](#express--connect-middleware)
  - [Web Dev Server](#web-dev-server)
  - [Rollup plugin](#rollup-plugin)
  - [Vite plugin](#vite-plugin)
  - [Astro integration](#astro-integration)
- [Possible improvements](#possible-improvements)
- [Notes on image optimization](#notes-on-image-optimization)
- [References](#references)

</div>

---

**Additional resources**

- [Demo projects](./demos)
- [API documentation](https://juliancataldo.github.io/og-images-generator/)

## Installation

```
npm i og-images-generator
```

Create a **`og-images.config.js`** in your current workspace root.

See this [og-images.example-config.js](./demos/__common/og-images.example-config.js) for a full working example. It's the config used in every [demo](./demos/).

_The gist is_:

```js
// ./og-images.config.js

import { html, styled, OG_SIZE, FONTS } from 'og-images-generator';

/** @type {import('og-images-generator').PathsOptions} (Optional) */
export const paths = {
	// DEFAULTS:
	base: './dist',
	out: './dist/og',
	json: './dist/og/index.json',
};

const myInlineStyle1 = styled.div`
	display: flex;
`;

const nestedTemplate1 = html`<span>My Website</span>`;

/** @type {import('og-images-generator').Template} */
export const template = ({ page }) =>
	html` <!-- Contrived example -->
		<div style=${myInlineStyle1}>
			${page.meta?.tags?.['og:title'] ?? 'Untitled'} <br />
			${page.meta?.tags?.['og:description'] ?? 'No description'}
			<!-- -->
			${nestedTemplate1}
			<em>Nice</em>
			<strong>Weather</strong>
		</div>`;

/** @type {import('og-images-generator').RenderOptions} */
export const renderOptions = {
	satori: { fonts: [await FONTS.sourceSans()], ...OG_SIZE },
};
```

**At the minimum**, you need to export `renderOptions` (with **size** and **font**) and `template` from your `og-images-generator` configuration file. \
`paths` are optional.

> [!NOTE]  
> **Helpers** \
> `styled.div` is a dummy strings concatenation literal (bringing syntax highlighting and formatting). \
> `div` is the only needed (and available) tag, as it makes no difference anyway for this sugar.
>
> Also, you don't need to wrap interpolated HTML attributes with quotes (e.g. `style="${foo}"`). \
> `<foo-bar style=${styles.baz}></foo-bar>` just works.

---

You can also just clone this repo. and play with the demos for your favorite environments. \
E.g.

```sh
git clone https://github.com/JulianCataldo/og-images-generator
cd og-images-generator
pnpm i -r # Recursive

cd demos/<…>

# Do the command(s) in the demo's README.
```

## Usage

**As a preamble**, don't forget to add the appropriate meta for your OGs, there are plenty of [resources](https://code.juliancataldo.com/component/astro-seo-metadata) on the web on how to set up your SEO with your favorite environment.

That way, `og-images-generator` will crawl them back to your template.

It will parse all the **meta tags** (in the head) and **JSON-LDs** script tags content (in the head and body).

---

By default:

- `https://example.com/` gives `https://example.com/og/index.png`
- `https://example.com/my-page/` gives `https://example.com/og/my-page.png`

> [!WARNING]  
> `/` → `index.png` is an exception. \
> We don't want `https://example.com/og.png`, as to keep this library output well segregated from the rest of your `dist` folder. \
> That's why so we need to disambiguate the root path.

For `https://example.com`:

```html
<meta property="og:image" content="https://example.com/og/index.png" />
```

```html
<meta property="og:image" content="https://example.com/og/nested/my-page.png" />
```

It's a contrived example. Fine-tuning SEO tags is a dark, ancient art. \
You'll need the `twitter:` stuff and other massaging, so you're sure it looks great everywhere.
But that's really out of the scope of this library, which does not mess with your HTML in the first place.

Alongside meta tags, JSON-LD blocks are also extracted and made available for your template to consume.

**_What if I need to attribute different templates depending on the page route?_** \
To achieve per URL template variations, add your branching logic in the root template. \
You can split and import full or partial templates accordingly if it grows too much, or to organize styles separately. \
Also, `page.url` is provided, alongside metadata (which should hold that info too, like `og:url`).

---

> [!TIP]  
> Recommended VS Code extensions
>
> - Styled Components for inline CSS highlighting: `styled-components.vscode-styled-components`
> - HTML highlighting: `bierner.lit-html`

Please note that the HTML to SVG engine under the hood ([Satori](https://github.com/vercel/satori)) has some limitations you have to be aware of. \
It's kind of trial and error, but overall, you can achieve incomparable results from pure SVGs, especially for things like typography and fluid layouts.

Hopefully, the [example configuration](./demos/__common/og-images.example-config.js) will guide you towards some neat patterns I'm discovering empirically and collected here.

> [!TIP]  
> **Vite** and **Astro** are supporting **automatic regeneration of your template** while your edit it, thanks to **HMR**. \
> It will even refresh your browser for you while you are visualizing your image inside an HTML document.

### CLI

```sh
npx generate-og

# defaults to
npx generate-og --base dist --out dist/og --json dist/og/index.json
```

### Programmatic (JS API)

Use this API if you want to build your custom workflow, or create a plugin for unsupported dev/build tools or JS runtimes (e.g. "serverless" functions, Astro's server endpoints…).

```js
import * as api from 'og-images-generator/api';

await api.generateOgImages(/* options */);

await api.renderOgImage(/* options */);
```

See also the [tests folder](./test) for more minimal insights.

### Express / Connect middleware

**`my-app.js`**:

```js
import express from 'express';

import { connectOgImagesGenerator } from 'og-images-generator/connect';

const app = express();

app.use(await connectOgImagesGenerator());

app.get('/', (_, res) => {
	res.send(`
		<html>
			<head>
				<meta property="og:title" content="Express / Connect demo" />
				<meta property="og:description" content="Welcome to my website!" />
			</head>
			<body> 
				<img src="/og/index.png"/>
			</body>
		</html>
	`);
});

app.listen(1234);
```

### Web Dev Server

```sh
npm i express-to-koa
npm i -D @types/express-to-koa
```

**`web-dev-server.config.js`**:

```js
import expressToKoa from 'express-to-koa';

import { connectOgImagesGenerator } from 'og-images-generator/connect';

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
	middleware: [expressToKoa(await connectOgImagesGenerator())],
};
```

### Rollup plugin

**`rollup.config.js`**:

```js
import { rollupOgImagesGenerator } from 'og-images-generator/rollup';

/** @type {import('rollup').RollupOptions} */
export default {
	plugins: [
		//
		rollupOgImagesGenerator(),
	],
};
```

### Vite plugin

**`vite.config.js`**:

```js
import { defineConfig } from 'vite';
import { viteOgImagesGenerator } from 'og-images-generator/vite';

export default defineConfig({
	plugins: [
		//
		viteOgImagesGenerator(),
	],
	build: {
		rollupOptions: {
			input: {
				foo: 'pages/foo.html',
				bar: 'pages/bar.html',
			},
		},
	},
});
```

### Astro integration

**`astro.config.js`**:

```js
import { defineConfig } from 'astro/config';

import { astroOgImagesGenerator } from 'og-images-generator/astro';

export default defineConfig({
	integrations: [
		//
		astroOgImagesGenerator(),
	],
});
```

> [!TIP]  
> You can leverage Astro's **server endpoints** capabilities, paired with the `og-images-generator` JS API and **Content Collections** (or any data source).  
> See [demos/astro/src/pages/og-endpoint-demo.ts](./demos/astro/src/pages/og-endpoint-demo.ts).

## Possible improvements

Use a worker pool for when batch rendering images (in build modes).  
Do benchmarks to ensure it's worth the complexity.

---

Explore externally included HTML snippets, and see how to style them. \
For example, add Source Sans font styles (for demo purposes)
and play with `<em></em>`, `<strong></strong>`, `<small></small>`… \
I've had mixed results here, due to the inline style limitation, but it's worth taking a look again. \
Typically, I prefer to keep titles and descriptions in plain text (`\n` and `\t` are safe) like `My description.\nHey!`. \
I enforce this rule everywhere: `package.json`, in metas, in JSON-LD, etc. No emojis either. \
It's usually better to avoid those fancy things here
because you can't control how vendor's crawlers will gobble up things.
However, I do want to add some styling support from rich text excerpts
at some point, even if we will have to be careful, as it opens up a can of worms.

---

Alongside meta tags and JSON-LD blocks, provide a way to consume HTML, e.g. `<template data-og-images></template>`.  
This will offer a way for users to do more advanced _per-route_ template injection, or for example, provide a rich-text description (see above).

---

Alongside all metadata, provide a way to consume `<script type="application/json" data-og-images></script>`,
which is typically found in SSRed setups, where a JSON payload is embedded in the HTML document, for further client hydration.

For now, a user who wants to transfer arbitrary data will have to abuse meta tags or JSON-LDs, which is not really optimal.

## Notes on image optimization

If you're running this on a server, you should use a CDN or any kind of proxying + caching, to handle on-the-fly image optimizations, with the rest of your assets. \
Also AFAIK, all major social network crawlers are transforming and caching assets themselves. \
It's their job to normalize optimizations in order to serve images to their users efficiently.

## References

- Vercel's Satori: [vercel/satori](https://github.com/vercel/satori)
- Nate Moore's HTML to Satori AST adapter: [natemoo-re/satori-html](https://github.com/natemoo-re/satori-html)
- SVG to PNG conversion with resvg: [yisibl/resvg-js](https://github.com/yisibl/resvg-js)
- Static HTML template literal authoring/rendering with Lit SSR: [lit/ssr](https://github.com/lit/lit/tree/d68f5c705484b9f6ea1f553d4851a9aa6a440db0/packages/labs/ssr)

# Known issues

- Emojis are not working with the `graphemeImages` Satori option.  
  Workaround: use something like [emoji-strip](https://www.npmjs.com/package/emoji-strip) by
  wrapping your injected text.
- When interpolating text into your template literal, Lit SSR is encoding [HTML entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity)
  while Satori isn't decoding them afterward. You could use Lit's `unsafeHTML` but you'll
  encounter a bug ([mixed dev/prod](https://github.com/lit/lit/pull/4515)).  
  In the meanwhile, `og-images-generator` will decode the full resulting
  template with the `entities` library, which could have some side effects (file an issue if that's the case).

---

**Other projects 👀**…

- [retext-case-police](https://github.com/JulianCataldo/retext-case-police): Check popular names casing. Example: ⚠️ `github` → ✅ `GitHub`.
- [remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema): Validate your Markdown **frontmatter** data against a **JSON schema**.
- [JSON Schema Form Element](https://github.com/json-schema-form-element/jsfe): Effortless forms, with standards.

---

<div align="center">

**Is this project useful to you?**

[![GitHub](https://img.shields.io/badge/Star_me_on_GitHub-222222?logo=github&style=social)](https://github.com/JulianCataldo/og-images-generator)

</div>

---

🔗  [JulianCataldo.com](https://www.juliancataldo.com)
