# <i-c o='ph:app-window-duotone'></i-c>Playground

Welcome to the Gracile playground!  
You'll get a taste of the [fully-featured developer experience](/docs/developer-experience/), minus some advanced language features, only available with the TypeScript Lit Analyzer Plugin/VSCode extension.

The "Basics" project will show you project structure, asset management, entity relationships, and API features… that will get you on board with Gracile.

---

<div align="center">

<!-- — [**Launch the playground** 🚀](/playground/) — -->

— [**Launch the playground** 🚀](https://gracile-play.netlify.app/) —

</div>

---

## Features

- **Monaco** Editor (VSCode)
- **TypeScript** language features
  - Click to definition
  - IntelliSense, etc.
- **CSS/HTML syntaxes highlighting** in template literals
- **HTML literal language** features (basic)
  - Quick info for tag/attribute
- **Prettier formatting** (including literals)
- **TextMate grammars** (richer than Monaco' Monarch)
- **Markdown** editing features
- **(S)CSS/HTML language** features
- Project (local) **persistence**
- **Emmet** (HTML/CSS)
- **Web Container**'ized Node dev. server
- **Live preview** for the webserver
- **Terminal output** for the webserver (Xterm)

> [!WARNING]
> It does not work with **Safari** yet, due to a **Web Container** runtime issue.

## Why?

The goal for building this playground wasn't to re-invent StackBlitz or Codesandbox, which are meant to be fully-featured IDEs,
but rather to provide a highly tailored environment for working with CSS/HTML template literals.  
As for now, Web Containers vendors aren't supporting **syntax highlighting**, **formatting** or **IntelliSense** for them.  
It also allows for a deeper integration, generally.

Hopefully, more features will be ported from the lit-html TS plugin or Lit Analyzer to the Custom TypeScript worker used in this REPL, and open-sourced back.

<!--
As a side note, it's theoretically possible to port most of Gracile features to the browser, in a Service Worker as a deployment target. This playground will make it much more adaptable to this use case compared to Web Container vendor solutions.
-->

## Known issues

> [!CAUTION]  
> This is an alpha app. Expect some weirdness.  
> If something goes to havoc, hit "Clear all data…" in <samp>Settings (⚙️) > Danger zone</samp>.

- `Response.redirect` isn't working inside the Web Container (CloudFront issue?).
- `Response.json` has missing typings in Monaco built-in TypeScript (old specs.).
- Monaco doesn't support Node's "exports conditions" (module resolution "Bundler").
- Web Container iframe is not on the same domain, so a "fake" browser navigation toolbar is implemented to control it via `postMessage`. You can still right-click on the iframe or use your browser's back/forward button for "real" control. In case of a big crash, you can go Home (`/`) or restart the Gracile Node process with this toolbar.
- [There are some unexpected behaviors](https://github.com/stackblitz/webcontainer-core/issues/1240) sometimes with Vite error tracing that will just happen in a Stackblitz' Web Container environment (Stackblitz.com or this playground, same).  
  It's not Gracile's fault as it seems to happen with other SSR frameworks like [SvelteKit](https://github.com/sveltejs/kit/issues/11451).  
  In the meantime, the demos will avoid triggering that carefully 😅. So please, keep this in mind when playing around.  
  Anyway, if you want a robust experience, just clone the demo projects below and play with it on your local computer 😃.
- Partial light mode theme

---

<div align="center">

— [**Sources for the demo projects**](https://github.com/gracile-web/starter-projects) —

</div>
