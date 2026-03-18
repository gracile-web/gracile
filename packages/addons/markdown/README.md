# Markdown

Import markdown files directly in HTML templates with your custom processing
pipeline or presets.  
Extracts the table of contents, frontmatter, excerpt and title.

> [!WARNING]  
> This API is subject to changes

## Installation

```sh
npm i @gracile/markdown

# Presets
npm i @gracile/markdown-preset-marked
```

> [!TIP] You can use this extension with any Vite+Lit setup!  
> It's totally decoupled from the framework.

```ts
// @filename: /vite.config.ts

import { defineConfig } from 'vite';

import { viteMarkdownPlugin } from '@gracile/markdown/vite';
import { MarkdownRenderer } from '@gracile/markdown-preset-marked';

export default defineConfig({
  // ...

  plugins: [
    viteMarkdownPlugin({ MarkdownRenderer }),
    // ...
  ],
});
```

## Usage

```ts
// @filename: /src/modules/my-partial.ts

import { html } from 'lit';

import myDocument from './my-document.md';

export const myPartial = html`
  <article>
    <h1>${myDocument.meta.title}</h1>
    <div class="content">${myDocument.body.lit}</div>
  </article>

  <details>
    <div>${myDocument.excerpt.lit}</div>
    <pre>${JSON.stringify(myDocument.meta.tableOfContents)}</pre>
    <pre>${JSON.stringify(myDocument.meta.frontmatter)}</pre>

    <pre>${JSON.stringify(myDocument.source.yaml)}</pre>
    <pre>${JSON.stringify(myDocument.path.relative)}</pre>
  </details>
`;

// @filename: /src/types.ts

// TIP: You can use these types to flesh out yours.
import type {
  MarkdownModule,
  TocLevel,
  Heading,
} from '@gracile/markdown/module';
```

### With Vite's glob import

```ts
// @filename: /src/content/content.ts

import type { MarkdownModule } from '@gracile/markdown/module';

export const blogPosts = import.meta.glob<MarkdownModule>(
  '/src/content/blog/**/*.md',
  { eager: true, import: 'default' },
);

// @filename: /src/routes/blog/[slug].ts

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { blogPosts } from '../../content/content.js';
import { document } from '../../document.js';

export default defineRoute({
  staticPaths: () =>
    Object.values(blogPosts).map((module) => ({
      params: { slug: module.meta.slug },
      props: {
        title: module.meta.title,
        content: module.body.lit,
        toc: module.meta.tableOfContents,
      },
    })),

  document: (context) => document({ ...context, title: context.props.title }),

  template: (context) => html`
    <pre>${JSON.stringify(context.props, null, 2)}</pre>
    ...
  `,
});
```

## Build your preset

The `MarkdownRenderer` class is used to produce a ready-to-consume, standardized
`MarkdownModule`.

[See the "_Marked_" preset](https://github.com/gracile-web/gracile/blob/main/packages/addons/markdown-preset-marked)
for a simple implementation of the `MarkdownRenderer` abstract class. It's under
100 lines of code!  
Also, it uses very few, light dependencies for achieving all tasks, like
transforming the MD, extracting the ToC, and other metadata.

As everyone has different needs, it's up to you to plug your custom pipeline;
Gracile may offer a basic preset with `remark` at some point, which could be
expanded or overridden.

## Server-side rendering

As with any `lit-html` templates, you can use Web Components inside Markdown,
they will be **server-side-rendered** and **hydrated** (if needed) once inside
the client!
