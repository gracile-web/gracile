import { router } from '../lib/router.js';

const root = document.documentElement;
const themedIconSelector = 'img[data-icon-dark-url], img[data-icon-light-url]';

function syncThemedIcons() {
	const colorMode =
		root.getAttribute('data-color-mode') === 'light' ? 'light' : 'dark';
	const modeDataKey =
		colorMode === 'light' ? 'iconLightUrl' : 'iconDarkUrl';

	for (const image of document.querySelectorAll<HTMLImageElement>(
		themedIconSelector,
	)) {
		const nextUrl = image.dataset[modeDataKey] || image.dataset.iconDefaultUrl;

		if (nextUrl && image.getAttribute('src') !== nextUrl) {
			image.setAttribute('src', nextUrl);
		}
	}
}

function initCardsHover() {
	const wrappers = globalThis.document.querySelectorAll('.cards');

	for (const w of wrappers) {
		const cards = w.querySelectorAll('.card');
		for (const c of cards) {
			c.addEventListener('mousemove', (event) => {
				if (event instanceof MouseEvent === false) return;
				for (const card of cards) {
					if (card instanceof HTMLElement === false) continue;

					const rect = card.getBoundingClientRect();
					const x = event.clientX - rect.left;
					const y = event.clientY - rect.top;

					card.style.setProperty('--x-pos', `${x}px`);
					card.style.setProperty('--y-pos', `${y}px`);
				}
			});
		}
	}
}

new MutationObserver(syncThemedIcons).observe(root, {
	attributeFilter: ['data-color-mode'],
	attributes: true,
});

syncThemedIcons();
requestIdleCallback(() => initCardsHover());
const callback = () => {
	syncThemedIcons();
	requestIdleCallback(() => initCardsHover());
};
router.removeEventListener('route-rendered', callback);
router.addEventListener('route-rendered', callback);
