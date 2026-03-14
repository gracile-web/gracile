import { html } from 'lit';

export const keepScrollingPositionCritical = html`
  <!--  -->
  <script>
    document.querySelectorAll('[data-keep-scroll-name]').forEach((element) => {
      const keepScrollName = element.dataset.keepScrollName;
      const savedPosition = sessionStorage.getItem(
        'gracile-keep-scroll-position--' + keepScrollName,
      );
      if (savedPosition) element.scrollTo({ top: Number(savedPosition) });
    });
  </script>
`;
