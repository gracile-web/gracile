import { html } from 'lit';

export const colorModeCritical = html`
  <script>
    {
      const root = document.documentElement;
      const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

      let colorMode = mediaQueryDark.matches ? 'dark' : 'light';

      mediaQueryDark.addEventListener('change', (event) => {
        colorMode = event.matches ? 'dark' : 'light';
        localStorage.setItem('colorMode', colorMode);
        root.setAttribute('data-color-mode', colorMode);

        // TODO: parametrize class toggle
        root.classList.remove('sl-theme-dark');
        root.classList.remove('sl-theme-light');
        root.classList.add('sl-theme-' + colorMode);
      });

      const mode = localStorage.getItem('colorMode') || colorMode;

      root.setAttribute('data-color-mode', mode);

      // TODO: parametrize class toggle
      root.classList.remove('sl-theme-dark');
      root.classList.remove('sl-theme-light');
      root.classList.add('sl-theme-' + mode);
    }
  </script>
`;
