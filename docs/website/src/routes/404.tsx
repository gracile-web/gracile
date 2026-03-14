import { defineRoute } from '@gracile/server/route';
import { document } from '../document/document.jsx';

import { FooterMain } from '../features/footer-main.jsx';
import { NavMain } from '../features/nav-main.jsx';

export default defineRoute({
  document: (context) =>
    document({
      ...context,
      title: '404: Not found',
      layout: 'bare',
      page: '404',
    }),

  template: ({ url }) => (
    <>
      <NavMain name={null} />

      <main>
        <h1>404 - Page not found</h1>

        <div>
          <p>Path:</p>
          <p>{url.pathname}</p>

          <hr />
          <p>
            <a href="/">
              <i-c o="house-duotone"></i-c> Back to Home
            </a>
          </p>
        </div>
      </main>

      <FooterMain url={url} />
    </>
  ),
});
