# Gracile Starter Project: Minimal setup (Bootstrap/Tailwind)

A project with popular vendors CSS preconfigured.

```sh
npm create gracile@latest -t minimal-bootstrap-tailwind
```

<div align="center">

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-bootstrap-tailwind?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-bootstrap-tailwind)

</div>

<div class="git-only">

> 🧚 **Already a Gracile pro?** Delete this file. Have fun!

</div>

## 🏗️ Project Structure

```text
├─ ⬛️ README.md
├─ 🟠 package.json
├─ 🟨 postcss.config.js
├─ 📂 public/
│   └─ 🔶 favicon.svg
├─ 📂 src/
│   ├─ 🟦 ambient.d.ts
│   ├─ 📂 content/
│   │   └─ 🟦 tailwind-demo.ts
│   ├─ 🟦 document.client.ts
│   ├─ 🔷 document.css
│   ├─ 🟦 document.ts
│   ├─ 📂 features/
│   │   ├─ 🔷 adopted-1.css
│   │   ├─ 🔷 adopted-2.css
│   │   ├─ 🟦 my-greetings-adopted.ts
│   │   ├─ 🟦 my-greetings-bootstrap.ts
│   │   ├─ 🟦 my-greetings-tailwind.ts
│   │   └─ 🟦 my-greetings.ts
│   ├─ 📂 routes/
│   │   ├─ 🟦 (home).client.ts
│   │   ├─ 🔷 (home).css
│   │   ├─ 🟦 (home).ts
│   │   ├─ 🟦 404.ts
│   │   ├─ 🟦 about.ts
│   │   ├─ 📂 bootstrap-demo/
│   │   │   ├─ 🟦 (index).client.ts
│   │   │   ├─ 🔷 (index).css
│   │   │   └─ 🟦 (index).ts
│   │   ├─ 📂 declarative-stylesheets-demo/
│   │   │   ├─ 🟦 (index).client.ts
│   │   │   ├─ 🔷 (index).css
│   │   │   └─ 🟦 (index).ts
│   │   └─ 📂 tailwind-demo/
│   │       ├─ 🟦 (index).client.ts
│   │       ├─ 🔷 (index).css
│   │       └─ 🟦 (index).ts
│   └─ 🔷 tailwind.css
├─ 🟨 tailwind.config.js
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
