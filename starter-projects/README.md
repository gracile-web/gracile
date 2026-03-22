# <i-c o='ph:fire-duotone'>🎇 </i-c>Starter projects

<div class="git-only">

_Gracile_.  
A thin, full-stack, **web** framework.

**Features**:

- Portable **HTML**, **CSS** and **JS**, thanks to **Lit (SSR)**.
- Highly responsive during dev. and build, thanks to **Vite**.
- **Minimal dependency footprint** for its **runtime** and your
  **distributable**.
- Embrace web standards like **Custom Elements** (aka Web Components) or the
  **WhatWG Fetch** API.
- A streamlined **D**eveloper e**X**perience for building, instead of fiddling
  around.

---

**Starters**:

- [🎇 Starter projects](#-starter-projects)
  - [Basics](#basics)
  - [Minimal setup (static)](#minimal-setup-static)
  - [Minimal setup (Bootstrap/Tailwind)](#minimal-setup-bootstraptailwind)
  - [Minimal setup with various kinds of test suites.](#minimal-setup-with-various-kinds-of-test-suites)
  - [Minimal setup (HTML/CSS minification)](#minimal-setup-htmlcss-minification)
  - [Minimal setup for client routing (SPA)](#minimal-setup-for-client-routing-spa)
  - [Minimal server (Express)](#minimal-server-express)
  - [Minimal server (Hono)](#minimal-server-hono)

</div>

<section class="cards tiles">

<div class="card"><div class="card-content">

## Basics

Get up and running with this all around demo of Gracile features.

- ✅ Minimal styling (make it your own!)
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ Markdown support
- ✅ SVG support
- ✅ Server-rendered Lit Elements

---

📥 **CLI**:

```sh
npm create gracile@latest -t basics
```

<div>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/basics?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/basics)

</div>

⏬ **Download**:

```sh
npx degit gracile-web/starter-projects/templates/basics my-project
```

📑 **Sources**:
[basics](https://github.com/gracile-web/starter-projects/tree/main/templates/basics)

</div></div>

<div class="card"><div class="card-content">

## Minimal setup (static)

A statically generated project.

📥 **CLI**:

```sh
npm create gracile@latest -t minimal-static
```

<div>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-static?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-static)

</div>

⏬ **Download**:

```sh
npx degit gracile-web/starter-projects/templates/minimal-static my-project
```

📑 **Sources**:
[minimal-static](https://github.com/gracile-web/starter-projects/tree/main/templates/minimal-static)

</div></div>

<div class="card"><div class="card-content">

## Minimal setup (Bootstrap/Tailwind)

A project with popular vendors CSS preconfigured.

📥 **CLI**:

```sh
npm create gracile@latest -t minimal-bootstrap-tailwind
```

<div>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-bootstrap-tailwind?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-bootstrap-tailwind)

</div>

⏬ **Download**:

```sh
npx degit gracile-web/starter-projects/templates/minimal-bootstrap-tailwind my-project
```

📑 **Sources**:
[minimal-bootstrap-tailwind](https://github.com/gracile-web/starter-projects/tree/main/templates/minimal-bootstrap-tailwind)

</div></div>

<div class="card"><div class="card-content">

## Minimal setup with various kinds of test suites.

Browser (Playwright), Unit tests (Node).

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

---

📥 **CLI**:

```sh
npm create gracile@latest -t minimal-testing
```

<div>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-testing?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-testing)

</div>

⏬ **Download**:

```sh
npx degit gracile-web/starter-projects/templates/minimal-testing my-project
```

📑 **Sources**:
[minimal-testing](https://github.com/gracile-web/starter-projects/tree/main/templates/minimal-testing)

</div></div>

<div class="card"><div class="card-content">

## Minimal setup (HTML/CSS minification)

Static/server and dev/build with minified CSS+HTML.

📥 **CLI**:

```sh
npm create gracile@latest -t minimal-minification
```

<div>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-minification?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-minification)

</div>

⏬ **Download**:

```sh
npx degit gracile-web/starter-projects/templates/minimal-minification my-project
```

📑 **Sources**:
[minimal-minification](https://github.com/gracile-web/starter-projects/tree/main/templates/minimal-minification)

</div></div>

<div class="card"><div class="card-content">

## Minimal setup for client routing (SPA)

Client-side routing demo, with hydration, for any mode.

📥 **CLI**:

```sh
npm create gracile@latest -t minimal-client-routing
```

<div>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-client-routing?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-client-routing)

</div>

⏬ **Download**:

```sh
npx degit gracile-web/starter-projects/templates/minimal-client-routing my-project
```

📑 **Sources**:
[minimal-client-routing](https://github.com/gracile-web/starter-projects/tree/main/templates/minimal-client-routing)

</div></div>

<div class="card"><div class="card-content">

## Minimal server (Express)

A Gracile handler, already set up with Express and static file serving.

📥 **CLI**:

```sh
npm create gracile@latest -t minimal-server-express
```

<div>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-server-express?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-server-express)

</div>

⏬ **Download**:

```sh
npx degit gracile-web/starter-projects/templates/minimal-server-express my-project
```

📑 **Sources**:
[minimal-server-express](https://github.com/gracile-web/starter-projects/tree/main/templates/minimal-server-express)

</div></div>

<div class="card"><div class="card-content">

## Minimal server (Hono)

A Gracile handler, already set up with Hono and static file serving.

📥 **CLI**:

```sh
npm create gracile@latest -t minimal-server-hono
```

<div>

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gracile-web/starter-projects/tree/main/templates/minimal-server-hono?embed=1)
&nbsp;&nbsp;&nbsp;&nbsp;
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gracile-web/starter-projects/tree/main/templates/minimal-server-hono)

</div>

⏬ **Download**:

```sh
npx degit gracile-web/starter-projects/templates/minimal-server-hono my-project
```

📑 **Sources**:
[minimal-server-hono](https://github.com/gracile-web/starter-projects/tree/main/templates/minimal-server-hono)

</div></div>

</section>

<div class="git-only">

---

- [Documentation website (gracile.js.org)](https://gracile.js.org/)
- [Documentation website repository](https://github.com/gracile-web/website)

---

> “Perfection is achieved, not when there is nothing more to add, but when there
> is nothing left to take away.”
>
> ―
> [Antoine de Saint-Exupéry](https://en.wikipedia.org/wiki/Antoine_de_Saint-Exup%C3%A9ry),
> _Airman's Odyssey_

</div>
