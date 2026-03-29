# @literals/html-css-minifier

_Minify HTML and CSS markup inside JavaScript template literal strings._

<div class="git-only">

[![npm](https://img.shields.io/npm/v/%40literals%2Fhtml-css-minifier.svg)](https://www.npmjs.com/package/%40literals%2Fhtml-css-minifier)

</div>

<!--  -->

## Why?

Template literals are often used in JavaScript to write HTML and CSS markup
(e.g. [Lit](https://lit.dev/),
[lit-html](https://www.npmjs.com/package/lit-html)). This library minifies that
markup, which is normally ignored by JavaScript minifiers.

## Usage

> [!IMPORTANT] All `@literals/*` packages are published as **ESM-only**.

```js
import { minifyHTMLLiterals } from '@literals/html-css-minifier';

const result = await minifyHTMLLiterals(
  `function render(title, items) {
    return html\`
      <style>
        .heading {
          color: blue;
        }
      </style>
      <h1 class="heading">\${title}</h1>
      <ul>
        \${items.map(item => {
          return getHTML()\`
            <li>\${item}</li>
          \`;
        })}
      </ul>
    \`;
  }`,
  { fileName: 'render.js' },
);
```

Minified output:

<!-- prettier-ignore -->
```js
function render(title, items) {
  return html`<style>.heading{color:#00f}</style><h1 class="heading">${title}</h1><ul>${items.map((item) => {
        return getHTML()`<li>${item}</li>`;
      })}</ul>`;
}
```

A v3 source map is also returned:

```js
console.log(result?.map);
```

```jsonc
{
  "version": 3,
  "file": "render.js.map",
  "sources": ["render.js"],
  /* ... */
}
```

## Supported Source Syntax

- JavaScript
- TypeScript

## Minification Engines

- **HTML** —
  [html-minifier-next](https://www.npmjs.com/package/html-minifier-next), the
  maintained successor to html-minifier-terser.
- **CSS** — [lightningcss](https://www.npmjs.com/package/lightningcss), a fast
  and standards-compliant CSS minifier.

### How CSS is handled

Static `` css`…` `` templates (no interpolations) are minified with
lightningcss. CSS templates **with interpolations are skipped entirely** — see
[Why no CSS interpolation support?](#why-no-css-interpolation-support) below.

CSS inside `<style>` blocks in `` html`…` `` templates is also minified with
lightningcss, unless the block contains template expression placeholders (which
would corrupt the CSS parser). In that case the block is left untouched —
`collapseWhitespace` still handles basic whitespace reduction.

## Options

### Basic

| Property          | Type     | Default                  | Description                                                                                                                |
| ----------------- | -------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `fileName`        | string   |                          | _Required._ The name of the file, used for syntax parsing and source maps.                                                 |
| `minifyOptions`   | object   | `defaultMinifyOptions`   | [html-minifier-next options](https://www.npmjs.com/package/html-minifier-next). Defaults to production-ready minification. |
| `shouldMinify`    | function | `defaultShouldMinify`    | Determines whether an HTML template should be minified. Defaults to templates whose tag contains "html" or "svg".          |
| `shouldMinifyCSS` | function | `defaultShouldMinifyCSS` | Determines whether a CSS template should be minified. Defaults to templates whose tag contains "css".                      |

### Advanced

<!-- prettier-ignore -->
| Property                | Type                                                                      | Default                    | Description                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `generateSourceMap?`    | boolean or `(ms: MagicString, fileName: string) => SourceMap | undefined` | `defaultGenerateSourceMap` | Set to `false` to disable source maps, or provide a custom function.                                              |
| `strategy?`             | object                                                                    | `defaultStrategy`          | An object with methods defining how to minify HTML and CSS.                                                       |
| `validate?`             | boolean or object                                                         | `defaultValidation`        | Set to `false` to disable validation, or provide custom validation functions. Only useful with a custom strategy. |
| `parseLiterals?`        | function                                                                  | `parseLiterals`            | Override the function used to parse template literals from a source string.                                       |
| `parseLiteralsOptions?` | object                                                                    |                            | Additional options to pass to `parseLiterals()`.                                                                  |
| `MagicString?`          | constructor                                                               | `MagicString`              | Override the MagicString-like constructor for source manipulation and source map generation.                       |

## Customization Examples

### Minify non-tagged templates

Useful for libraries that define templates without tags, such as Polymer's
`<dom-module>`:

```js
import {
  minifyHTMLLiterals,
  defaultShouldMinify,
} from '@literals/html-css-minifier';

await minifyHTMLLiterals(source, {
  fileName: 'render.js',
  shouldMinify(template) {
    return (
      defaultShouldMinify(template) ||
      template.parts.some((part) => part.text.includes('<dom-module>'))
    );
  },
});
```

### Disable CSS minification

```js
await minifyHTMLLiterals(source, {
  fileName: 'render.js',
  shouldMinifyCSS: () => false,
});
```

### Custom source map

```js
await minifyHTMLLiterals(source, {
  fileName: 'render.js',
  generateSourceMap(ms, fileName) {
    return ms.generateMap({
      file: `${fileName}-converted.map`,
      source: fileName,
      includeContent: true,
    });
  },
});
```

## Dynamic Tag Names

Libraries like [Shoelace](https://shoelace.style/) /
[Web Awesome](https://webawesome.com/) sometimes use dynamic tag names (e.g.
`` html`<${tag} class="foo"></${tag}>` ``). The placeholder value
(`@TEMPLATE_EXPRESSION();`) is not a valid HTML tag name, which would cause
parse errors.

This library detects expressions in tag-name position (right after `<` or `</`)
and substitutes a valid custom element placeholder (`template-expression-tag`)
so that html-minifier-next can parse without errors. The placeholder is restored
when splitting the minified result back into template parts.

## TypeScript in `<script>` Tags

HTML templates containing `<script lang="ts">` blocks have their TypeScript
types automatically stripped before HTML minification. The `lang` attribute is
removed from the output. This uses the TypeScript compiler's `transpileModule`
for safe type erasure without syntax downleveling.

## ES5 Transpiling Warning

Minify template literals _before_ transpiling to ES5. Otherwise, the API will
not find any template literal (`` `${}` ``) strings.

## Why No CSS Interpolation Support?

Previous versions attempted to minify CSS containing `${…}` placeholders by
substituting them with CSS-safe tokens before feeding the result to a CSS
minifier. This was fragile — placeholders can appear in selectors, at-rules,
property values, or across declaration boundaries — and any CSS minifier that
actually parses the input (as it should) will choke on or silently drop rules
with invalid tokens.

Rather than maintaining increasingly complex workarounds, v3 drops CSS
interpolation support. Here's why this is the right trade-off:

**The ecosystem has moved past runtime CSS interpolation.** The pattern of
`` css`color: ${dynamicValue}` `` was popularized by styled-components and
Emotion. Both libraries are in maintenance mode. Their successors — Tailwind
CSS, vanilla-extract, Panda CSS — use build-time extraction or variant/recipe
APIs instead of arbitrary runtime interpolation. Even Josh Comeau, a long-time
styled-components advocate, now recommends CSS custom properties over prop
interpolation, noting that interpolated styles force a new CSS rule injection on
every value change.

**Lit's `css` tag is static by design.** Lit explicitly restricts `css` tag
interpolations to nested `css`-tagged strings or numbers — no arbitrary
expressions. The `unsafeCSS()` escape hatch exists but is intended for importing
external CSS blobs, not fine-grained dynamic values. For dynamic styling, Lit
recommends CSS custom properties set via the `style` attribute in `html`
templates.

**`<style>` bindings in `html` templates don't work in Lit either.** `<script>`,
`<style>`, `<textarea>`, and `<title>` are raw text elements in HTML. Lit's
parser cannot place bindings inside them. Interpolating into `<style>` content
requires `unsafeHTML()` wrapping the entire element, which produces an opaque
string blob invisible to this minifier anyway.

**What to use instead:**

- For dynamic values: CSS custom properties (`--my-color`), set via
  `style="--my-color: ${value}"` in your `html` template.
- For conditional styles: class-based toggling with `classMap()` or similar.
- For static CSS in `css` templates: works out of the box, minified by
  lightningcss.

## Migration from v2

### Breaking changes

- **CSS interpolation in `css` tagged templates is no longer supported.**
  Templates with interpolations (e.g. `` css`color: ${expr}` ``) are now skipped
  entirely. Static `css` templates (no `${}`) are minified with lightningcss.
- **`adjustMinifyCSSOptions` export removed.** This was specific to clean-css
  internals.
- **`minifyOptions.minifyCSS` is now a function internally.** CSS inside
  `<style>` blocks in HTML templates is minified with lightningcss, unless the
  block contains template expression placeholders (which would corrupt the CSS
  parser). Do not override `minifyCSS` in your `minifyOptions` — the built-in
  function handles placeholder detection automatically.
- Dependencies changed: `html-minifier-terser` -> `html-minifier-next`,
  `clean-css` -> `lightningcss`.

### Behavioral differences from html-minifier-terser

These are minor output differences between html-minifier-terser and
html-minifier-next. They do not affect correctness.

- **Unquoted non-standard attributes are preserved as-is.** html-minifier-terser
  would add quotes around non-standard attribute placeholders (e.g.
  `.icon="${expr}"`). html-minifier-next leaves them unquoted (`.icon=${expr}`),
  which matches Lit's binding syntax more faithfully.
- **`<pre>` whitespace trimming.** html-minifier-next trims trailing whitespace
  before `</pre>` more aggressively. For example,
  `within certain tags\n        </pre>` becomes `within certain tags</pre>`. The
  content inside is preserved; only trailing whitespace between the last text
  and the closing tag is affected.
