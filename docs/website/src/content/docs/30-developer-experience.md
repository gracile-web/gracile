## <i-c o='ph:head-circuit-duotone'></i-c>Developer experience

One of the primary reasons for building Gracile was to participate in unifying full-stack Web Components development.  
While there is room to catch well-known stacks, we are starting with an advantage:
fewer layers of abstractions to deal with.

The framework provides conventions, runtime goodies etc. that's cool.
But we also need a solid editing environment, with insights and refactoring assistance.

This section will be updated to better reflect the progress of this endeavor.

## Plugins/Extension

### Lit Analyzer

[**Lit Analyzer**](https://github.com/runem/lit-analyzer) is a must-have collection
of tools that will bring:

- **IDE popups/completion** for HTML and CSS template literals (IDE extension only).
- **TypeScript** properties validation for **Custom Elements**.
- HTML **linting**.
- Accessibility hints.
- Syntaxes highlightings
- Emmet for CSS/HTML
- And much more…

It's available as both a **VSCode** plugin OR a **TypeScript** plugin that will work
in every editor that supports the TypeScript language server (Zed, Neovim…).

This website doesn't show the richness that this tool will bring\* to your
authoring experience, so you might be urged to test it yourself in your local environment!

<small>\* TypeScript plugins don't seem to work with Shiki Twoslash.</small>

### Lint/format

- `eslint`
- `eslint-plugin-lit-a11y`
- `eslint-plugin-lit`
- `eslint-plugin-wc`
- `prettier` (only formatter that supports literal embedded HTML)
- `stylelint`

<!-- ## Environment switching

- `esm-env`, which aligns with Vite behavior. -->

## Miscellaneous

### Browser dev'tools comfort

When working with Lit templates, you'll find a lot of "marker" comments in the
produced output, e.g., ` <!--lit-part prGdWBNEVq4=-->`.

It is used notably for hydration and Lit's template client rendering system.

As HTML comments are _mostly_ useful when reading the source code in your text editor,
it's possible to unclutter your browser view while developing.  
For that, you can uncheck <samp>Settings > Preferences > Elements > Show HTML comments</samp> in Chromium-like developer tools.

It's pretty nice to cut the noise like this if you want, especially when
you compare with other markers mechanisms (e.g., CSS scoping…), where
those random strings belong IN your effective markup, not comments.

Be aware that you SHOULD NOT minify and remove comments while building.

For now, comments are not removed with Gracile.

It could be possible to build a comment stripper that preserves Lit's specific markers but not your comments.
