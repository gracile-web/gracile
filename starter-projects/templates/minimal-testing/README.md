# Gracile Starter Project: Minimal setup with various kinds of test suites.

Browser (Playwright), Unit tests (Node).

```sh
npm create gracile@latest -t minimal-testing
```

Features:

**Available commands**

```sh
test:unit
test:unit:dev

test:integration
test:integration:dev

test:component
test:component:dev

test:e2e
test:e2e:dev

test:all
```
    

<div align="center">

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-testing?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-testing)

</div>

<div class="git-only">

> 🧚 **Already a Gracile pro?** Delete this file. Have fun!

</div>

## 🏗️ Project Structure

```text
├─ ⬛️ README.md
├─ 🟠 package.json
├─ 📂 playwright/
│   ├─ undefined index.html
│   └─ 🟦 index.ts
├─ 🟦 playwright-ct.config.ts
├─ 🟦 playwright.config.ts
├─ 📂 public/
│   └─ 🔶 favicon.svg
├─ 🟨 server.js
├─ 📂 src/
│   ├─ 🟦 ambient.d.ts
│   ├─ 🟦 document.client.ts
│   ├─ 🔷 document.css
│   ├─ 🟦 document.ts
│   ├─ 📂 features/
│   │   ├─ 🟦 my-greetings.ts
│   │   ├─ 🟦 my-server-template-1.ts
│   │   └─ 🟦 my-template-1.ts
│   ├─ 📂 lib/
│   │   └─ 🟦 my-lib-1.ts
│   └─ 📂 routes/
│       ├─ 🟦 (home).client.ts
│       ├─ 🔷 (home).css
│       ├─ 🟦 (home).ts
│       ├─ 🟦 404.ts
│       ├─ 🟦 about.ts
│       └─ 📂 api/
│           └─ 🟦 [...path].ts
├─ 📂 tests/
│   ├─ 📂 component/
│   │   ├─ 🟦 my-lit-templates.test.ts
│   │   └─ 🟦 sss.spec.ts
│   ├─ 📂 e2e/
│   │   └─ 🟦 simple-browser-tests.spec.ts
│   ├─ 📂 integration/
│   │   ├─ 🟦 my-api-endpoints.test.ts
│   │   ├─ 🟦 my-lit-templates.test.ts
│   │   └─ undefined my-lit-templates.test.ts.snapshot
│   ├─ undefined launch-all.sh*
│   ├─ 📂 test/
│   │   └─ 🟦 my-dummy-unit.test.ts
│   └─ 📂 unit/
│       ├─ 🟦 my-dummy-unit.test.ts
│       └─ 🟦 my-lit-templates.test.ts
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

Or the [TypeScript Language Server plugin](https://github.com/runem/lit-analyzer/tree/master/packages/ts-lit-plugin#-installation)
for NeoVim, Zed, etc.

---

For general **formatting**,
with support for HTML and CSS **template tag literals** in JavaScript:

```sh
npm i prettier
```

## 🧠 Want to learn more?

Check out the [Gracile documentation](https://gracile.js.org) or
jump into the [Discord server](https://gracile.js.org/chat/).
