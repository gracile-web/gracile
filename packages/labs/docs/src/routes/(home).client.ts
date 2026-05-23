import { router } from '../lib/router.ts';

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

requestIdleCallback(() => initCardsHover());
const callback = () => requestIdleCallback(() => initCardsHover());
router.removeEventListener('route-rendered', callback);
router.addEventListener('route-rendered', callback);
