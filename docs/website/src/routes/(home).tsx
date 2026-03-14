import { defineRoute } from '@gracile/server/route';
import { document } from '../document/document.jsx';

import wcLogo from '../assets/webcomponents-logo.svg?url';
import viteLogo from '../assets/vite-logo.svg?url';
import litLogo from '../assets/lit.svg?url';
import nodeJsLogo from '../assets/nodejs-logo.svg?url';

import { SplashScreen } from '../features/splash-screen.jsx';
import { FooterMain } from '../features/footer-main.jsx';
import { NavMain } from '../features/nav-main.jsx';
import { NavRight } from '../features/nav-right.jsx';

import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';

import { featureList } from '../content/feature-list.js';
import { isServer } from 'lit';
import { router } from '../lib/router.js';
import { blogMetaImports } from '../content/content.js';

export default defineRoute({
  handler: async () => ({
    mainReadme: await import('../content/README.md'),
    starterProjects:
      await import('../content/docs/04-starter-projects/README.md'),
    faq: await import('../content/docs/35-faq.md'),
  }),

  document: ({ url, props }) =>
    document({
      url,
      title: props.mainReadme.title,
      description: props.mainReadme.excerpt,
      layout: 'bare',
    }),

  template: ({ url, props }) => (
    <>
      <NavMain name={null} />

      <SplashScreen />

      <main>
        <article class="prose">
          <h1>
            {/* <i-c o="ph:toolbox" /> */}
            Works With
          </h1>
          <section class="works-with">
            <ul>
              <li>
                <img src={nodeJsLogo} />
                <div>
                  <strong>Node.js</strong>
                  <br /> & compatible
                </div>
              </li>
              <li>
                <img src={viteLogo} />
                <div>
                  <strong>Vite</strong>
                  <br /> ecosystem
                </div>
              </li>
              <li>
                <img src={litLogo} />
                <div>
                  <strong>Lit</strong>
                  <br /> ecosystem
                </div>
              </li>
              <li>
                <img src={wcLogo} />
                <div>
                  <strong>Web Components</strong>
                  <br /> & web APIs
                </div>
              </li>
            </ul>
          </section>

          <h1>
            {/* <i-c o="ph:toolbox" /> */}
            Main Features
          </h1>

          <section class="features cards">
            <div>
              <For each={featureList}>
                {(feature) => (
                  <a class="card" href={feature.href} for:key={feature.title}>
                    <article class="card-content">
                      <div>
                        <strong class="feature-title">{feature.title}</strong>
                        <p>
                          {feature.desc.slice(0, 75)}
                          {feature.desc.length > 75 ? '...' : ''}
                        </p>
                      </div>
                      {/* <footer>
                      <For each={feature.tags} key={(tag) => tag}>
                        {(tag) => <span class="tag">{tag}</span>}
                      </For>
                    </footer> */}
                    </article>
                  </a>
                )}
              </For>
            </div>

            <footer class="features-more">
              <a href="/docs/learn/usage/">See more…</a>
            </footer>
          </section>

          <h1 unsafe:html={props.starterProjects.titleHtml} />
          <section class="cards tiles">
            <For each={props.starterProjects.toc.at(0)?.children || []}>
              {(lvl) => (
                <div class="card card-link" for:key={lvl.id}>
                  <a
                    href={`/docs/starter-projects/#doc_${lvl.id}`}
                    class="card-content"
                  >
                    {lvl.value}
                  </a>
                </div>
              )}
            </For>
          </section>

          <section class="home-readme" unsafe:html={props.mainReadme.content} />

          <h1 unsafe:html={props.faq.titleHtml} />

          <section class="cards tiles">
            <For each={props.faq.toc.at(0)?.children || []}>
              {(lvl) => (
                <div class="card card-link" for:key={lvl.id}>
                  <a href={`/docs/faq/#doc_${lvl.id}`} class="card-content">
                    {lvl.value}
                  </a>
                </div>
              )}
            </For>
          </section>

          <h1>
            <i-c o="ph:newspaper" />
            Blog
          </h1>
          <section class="cards tiles">
            <For each={blogMetaImports.slice(0, 6).filter((p) => p.pathParams)}>
              {(post) => (
                <div class="card card-link" for:key={post.href}>
                  <a
                    href={post.href}
                    class="card-content"
                    unsafe:html={post.module.title}
                  />
                </div>
              )}
            </For>
          </section>
        </article>
      </main>

      <NavRight markdownModule={null} />

      <FooterMain url={url} filename={props.mainReadme.path} />
    </>
  ),
});

function initCardsHover() {
  const wrappers = globalThis.document.querySelectorAll('.cards');

  wrappers.forEach((w) => {
    const cards = w.querySelectorAll('.card');
    cards.forEach((c) => {
      c.addEventListener('mousemove', (event) => {
        if (event instanceof MouseEvent === false) return;
        cards.forEach((card) => {
          if (card instanceof HTMLElement === false) return;

          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          card.style.setProperty('--x-pos', `${x}px`);
          card.style.setProperty('--y-pos', `${y}px`);
        });
      });
    });
  });
}

if (!isServer) {
  requestIdleCallback(() => initCardsHover());
  const callback = () => requestIdleCallback(() => initCardsHover());
  router.removeEventListener('route-rendered', callback);
  router.addEventListener('route-rendered', callback);
}
