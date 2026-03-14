# Home

<div class="git-only">

A thin, full-stack, **web** framework.

</div>

# <i-c o="ph:lightbulb-duotone"></i-c>Annotated Examples

<section class="code-example">

<!-- ```html
      < !-- NOTE: Bundles entrypoints for the current page assets -- >
      <link rel="stylesheet" href="/src/routes/index.scss" />
      <script type="module" src="/src/routes/index.client.ts"></script>


``` -->

```ts twoslash
// @filename: /src/lib/db.ts

/** Dummy DB handler… */
export const db = {
  query<T>(str: string) {
    return {} as T[];
  },
};

export type Achievement = { name: string; date: Date };

/** Dummy SQL template literal… */
export function sql(str: string) {
  return '';
}
// ---cut---
// TIP: You can hover/tap source code tokens, like in your local code editor, to get more insights.

// @filename: /src/document.ts

import { html } from '@gracile/gracile/server-html';

export const document = (props: { url: URL; title?: string }) => html`
  <!doctype html>
  <html lang="en">
    <head>
      <!-- NOTE: Global assets -->
      <link rel="stylesheet" href="/src/styles/global.scss" />
      <script type="module" src="/src/document.client.ts"></script>

      <!-- NOTE: SEO -->
      <title>${props.title ?? 'My Website'}</title>

      <!-- ... -->
    </head>

    <body>
      <!-- IMPORTANT: Current route's page injection -->
      <route-template-outlet></route-template-outlet>
    </body>
  </html>
`;

// @filename: /src/routes/index.ts

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { db, sql, Achievement } from '../lib/db.js';

import { document } from '../document.js';
import homeReadme from '../content/README.md';

import type { MyElement } from '../features/my-element.ts';
import '../features/my-element.js';

export default defineRoute({
  handler: {
    POST: async (context) => {
      const formData = await context.request.formData();
      const name = formData.get('achievement')?.toString();

      if (name) {
        await db.query(sql`INSERT INTO achievements (name); VALUES (${name})`);

        return Response.redirect(context.url, 303);
      }

      const message = 'Wrong input!' as const;
      context.responseInit.status = 400;
      return { success: false, message };
    },
  },

  document: (context) =>
    document({ url: context.url, title: homeReadme.meta.title }),

  template: async (context) => {
    const initialData = { foo: 'bar' } satisfies MyElement['initialData'];

    const achievements = await db.query<Achievement>(
      sql`SELECT * FROM achievements`,
    );

    return html`
      <h1>${homeReadme.meta.title}</h1>

      <main>
        <article>${homeReadme.body.lit}</article>
      </main>

      <aside>
        <form method="post">
          <input type="text" name="achievement" />
          <button>Add achievement</button>

          <span>${context.props.POST?.message}</span>
        </form>

        <my-element initialData=${JSON.stringify(initialData)}></my-element>
        <my-client-only-element></my-client-only-element>

        <footer>
          ${achievements.map(
            (achievement) =>
              html`<section class=${`achievement-${achievement.name}`}>
                <h1>${achievement.name}</h1>
                <p>${achievement.date}</p>
              </section>`,
          )}
        </footer>
      </aside>

      <footer>
        <small>You are visiting ${context.url.href}</small>
      </footer>
    `;
  },
});

// @filename: /src/routes/index.client.ts

// NOTE: Importing your components in this page's client bundle entrypoint will make the server markup alive.

requestIdleCallback(() => import('../features/my-element.js'));
// ...

// TIP: Don't import on server-side, if you want a client-only element.
import '../features/my-client-only-element.js';

console.log('Welcome', navigator.userAgent);
// ...

// @filename: /src/features/my-element.ts

import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('my-element')
export class MyElement extends LitElement {
  static readonly GREETING = 'Hello';

  @property({ type: Object }) initialData: { foo?: string } = {};

  @property({ type: Number }) bgTint = 0.5;

  render() {
    return html`
      <div
        @click=${() => (this.bgTint = Math.random())}
        style=${styleMap({ '--bg-tint': this.bgTint })}
      >
        ${this.initialData.foo} - ${MyElement.GREETING}
      </div>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        margin: 1rem;
      }

      div {
        background: hsl(calc(var(--bg-tint, 0) * 360), 50%, 50%);
      }
    `,
  ];
}
```

<!-- See the start projects -->

</section>

# <i-c o="ph:highlighter-duotone"></i-c>Highlights

<section class="cards tiles">

<div class="card"><div class="card-content">

## <i-c o="ph:hand-peace-duotone"></i-c>Ease of use

Write the same markup, styling and scripting languages for both server and
client side.  
The ones that you already know and use everywhere else: **HTML**, **CSS** and
**JavaScript**.

Simplicity doesn't mean obfuscation. You're still in charge without abandoning flexibility to your framework.

</div></div><div class="card"><div class="card-content">

## <i-c o="ph:scroll-duotone"></i-c>Standards oriented

Built with a platform-minded philosophy. Every time a standard can be leveraged
for a task, it should be.  
It also means fewer vendor-specific idioms to churn on and a more portable
codebase overall.  
Stop re-implementing the wheel, and embrace **future-proof APIs**, you'll thank
yourself later!

</div></div><div class="card"><div class="card-content">

## <i-c o="ph:head-circuit-duotone"></i-c>Developer experience

The DX bar has been constantly raised, alongside developers' expectations about
their everyday tooling.  
The "Vanilla" community is full of gems, in a scattered way.  
Gracile provides an integrated, **out-of-the-box** experience while keeping
non-core opinions as _opt-ins_.

</div></div><div class="card"><div class="card-content">

## <i-c o="ph:book-open-text-duotone"></i-c>Convention over configuration

Finding the right balance between **convenience** and **freedom** is tricky.  
Hopefully, more and more patterns will be established in the full-stack JS
space.

Gracile is inspired by those widespread practices that will make you feel at
home.

</div></div><div class="card"><div class="card-content">

## <i-c o="ph:feather-duotone"></i-c>Light and unobtrusive

All in all, the Gracile framework is just Vite, Lit SSR and a very **restricted set of helpers and third parties**.  
Check its [dependency tree on npmgraph](https://npmgraph.js.org/?q=@gracile/gracile), you'll see by yourself.  
Also, everything is done to **keep your Vite configuration as pristine as possible**. Augmenting an existing project can be done in a pinch, with no interference.

</div></div><div class="card"><div class="card-content">

## <i-c o="ph:lightning-duotone"></i-c>Performances

**Speed is not the main goal** for Gracile, that's because it is just the sane
default you'll start with.  
Avoiding complex template transformations, or surgically shipping client-side JS
are just a few facets of what makes Gracile a "_do more with less_" power tool.

</div></div>

</section>

<!-- # FAQ

<section>

<asciinema-player
        href="/assets/create-gracile.cast"
        loop
        autoplay
        speed="1.3334"
        theme="gracile"
      >
<asciinema-player-header slot="header"
          >create gracile</asciinema-player-header
        >
</asciinema-player>

</section> -->

<!-- NOTE: You can use inline (deferred) modules or in-path scripts… -->
<!-- <script type="module">
  await new Promise((r) => setTimeout(() => r(console.log('Hi!')), 1500));
</script> -->
