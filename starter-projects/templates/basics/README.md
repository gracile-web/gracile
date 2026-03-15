# Gracile Starter Project: Basics

Get up and running with this all around demo of Gracile features.

```sh
npm create gracile@latest -t basics
```

Features:

- ✅ Minimal styling (make it your own!)
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ Markdown support
- ✅ SVG support
- ✅ Server-rendered Lit Elements

<div align="center">

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/basics?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/basics)

</div>

<div class="git-only">

> 🧚 **Already a Gracile pro?** Delete this file. Have fun!

</div>

## 🏗️ Project Structure

```text
├─ ⬛️ README.md
├─ 🟠 package.json
├─ 📂 public/
│   └─ 🔶 favicon.svg
├─ 🟨 server.js
├─ 📂 src/
│   ├─ 🟦 ambient.d.ts
│   ├─ 📂 assets/
│   │   └─ 🔶 gracile-logo.svg
│   ├─ 🟪 common.scss
│   ├─ 🟦 constants.ts
│   ├─ 📂 content/
│   │   ├─ ⬛️ about.md
│   │   ├─ 📂 blog/
│   │   │   ├─ ⬛️ bouillabaisse-ftw.md
│   │   │   ├─ ⬛️ i-love-js.md
│   │   │   ├─ ⬛️ linux-is-rad.md
│   │   │   ├─ ⬛️ pointlessness.md
│   │   │   └─ ⬛️ rust-is-cool.md
│   │   ├─ 🟦 content.ts
│   │   └─ 🟦 home.ts
│   ├─ 🟦 document.client.ts
│   ├─ 🟪 document.scss
│   ├─ 🟦 document.ts
│   ├─ 📂 features/
│   │   ├─ 🟦 cool-canvas.ts
│   │   ├─ 📂 counters/
│   │   │   ├─ 🟪 counters.scss
│   │   │   ├─ 🟦 my-lit-counter.ts
│   │   │   └─ 🟦 my-vanilla-counter.ts
│   │   ├─ 🟪 gracile-welcome.scss
│   │   ├─ 🟦 gracile-welcome.ts
│   │   ├─ 📂 shell/
│   │   │   ├─ 🟦 footer.ts
│   │   │   ├─ 🟦 header.ts
│   │   │   ├─ 🟦 menu.ts
│   │   │   └─ 🟪 shell.scss
│   │   └─ 🟦 tree.ts
│   ├─ 📂 routes/
│   │   ├─ 🟦 (home).client.ts
│   │   ├─ 🟪 (home).scss
│   │   ├─ 🟦 (home).ts
│   │   ├─ 🟦 404.ts
│   │   ├─ 🟦 about.ts
│   │   ├─ 📂 blog/
│   │   │   ├─ 🟪 (blog).scss
│   │   │   ├─ 🟦 (blog).ts
│   │   │   ├─ 🟪 [slug].scss
│   │   │   └─ 🟦 [slug].ts
│   │   ├─ 📂 form/
│   │   │   ├─ 🟦 regular.ts
│   │   │   ├─ 🟦 with-js.client.ts
│   │   │   └─ 🟦 with-js.ts
│   │   ├─ 📂 json/
│   │   │   ├─ 🟦 (json).client.ts
│   │   │   ├─ 🟦 (json).ts
│   │   │   └─ 📂 api/
│   │   │       └─ 📂 simple/
│   │   │           └─ 🟦 [...path].ts
│   │   ├─ 📂 markdown-editor/
│   │   │   ├─ 🟦 (editor).client.ts
│   │   │   ├─ 🟦 (editor).ts
│   │   │   └─ 🟦 markdown-api.ts
│   │   └─ 📂 streams/
│   │       ├─ 🟦 (streams).client.ts
│   │       ├─ 🟦 (streams).ts
│   │       └─ 📂 server-events/
│   │           └─ 🟦 (server-events).ts
│   └─ 🟪 tokens.scss
├─ 🟠 tsconfig.json
└─ 🟦 vite.config.ts
```

## 🪄 Commands

All commands are run from the root of the project, from a terminal:

| Command              | Action                                       |
| :------------------- | :------------------------------------------- |
| `npm install`        | Installs dependencies                        |
| `node --run dev`     | Starts local dev server at `localhost:4567`  |
| `node --run check`   | Type-check your project sources              |
| `node --run build`   | Build your production site to `./dist/`      |
| `node --run preview` | Preview your build locally, before deploying |

## 🛠️ Tooling

Enhance your developer experience with the **Lit Analyzer** toolset and
**Prettier**.

For syntax highlight, **HTML** and **CSS** MDN references, **custom elements**
attributes/properties **hints**, **validation** etc., checkout:

The VS Code extension:

```sh
code --install-extension runem.lit-plugin
```

Or the
[TypeScript Language Server plugin](https://github.com/runem/lit-analyzer/tree/master/packages/ts-lit-plugin#-installation)
for NeoVim, Zed, etc.

---

For general **formatting**, with support for HTML and CSS **template tag
literals** in JavaScript:

```sh
npm i prettier
```

## 🧠 Want to learn more?

Check out the [Gracile documentation](https://gracile.js.org) or jump into the
[Discord server](https://gracile.js.org/chat/).
