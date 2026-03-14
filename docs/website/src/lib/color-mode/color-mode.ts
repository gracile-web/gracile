import { router } from '../router.js';

const root = document.documentElement;

document.addEventListener('click', (event) => {
	if (
		event.target instanceof HTMLElement &&
		event.target.hasAttribute('data-color-mode-switch')
	) {
		const currentMode = root.getAttribute('data-color-mode');
		const colorMode = currentMode === 'light' ? 'dark' : 'light';
		root.setAttribute('data-color-mode', colorMode);

		localStorage.setItem('colorMode', colorMode);

		// TODO: parametrize
		root.classList.remove('sl-theme-' + currentMode);
		root.classList.add('sl-theme-' + colorMode);
	}
});

router.addEventListener('route-rendered', () => {
	const currentMode = root.getAttribute('data-color-mode');
	root.classList.remove('sl-theme-dark');
	root.classList.remove('sl-theme-light');

	root.classList.add('sl-theme-' + currentMode);
});

export {};
