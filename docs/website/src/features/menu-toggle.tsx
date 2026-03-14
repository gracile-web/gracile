import { router } from '../lib/router.js';

// import { asideMenuState, mainMenuState } from '../lib/app-state.js';

export const MenuToggle = (options: {
  position: 'left' | 'right';
  label?: string;
}) => (
  <button
    // data-menu-toggle
    class:list={['c-menu-toggle', 'toggle', options.position]}
    aria-label="Toggle menu"
    on:click={() => {
      // const state =
      //   options.position === 'left' ? mainMenuState : asideMenuState;
      // if (state.get() === 'closed') state.set('opened');
      // else state.set('closed');

      const name = `menu-${options.position}`;
      const state = document.documentElement.getAttribute(name);
      document.documentElement.setAttribute(
        name,
        state === 'opened' ? 'closed' : 'opened',
      );
    }}
  >
    {options.label ?? 'menu'}
  </button>
);

router.addEventListener('route-changed', () => {
  document.documentElement.setAttribute('menu-left', 'closed');
  document.documentElement.setAttribute('menu-right', 'closed');
  // mainMenuState.set('closed');
  // asideMenuState.set('closed');
});
