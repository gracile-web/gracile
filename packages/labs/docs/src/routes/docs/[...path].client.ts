import { router } from '../../lib/router.js';

// NOTE: Disabled, randomly broke and too much maintenance/bundle size cost.
// Maybe use the embeddable iframe instead?
async function loadAsciinema() {
	// if (
	//   globalThis.document.location.pathname ===
	//   '/docs/learn/getting-started/installation/'
	// ) {
	//   await import('../../lib/asciinema-player/asciinema-player.js');
	//   await import('../../components/asciinema-player-header.js');
	// }
}

requestIdleCallback(() => {
	void import('../../lib/toc-links-follower.js');
	// @ts-expect-error no typings
	void import('caniuse-embed-element/dist/caniuse-embed-element.js');
});

await loadAsciinema();
router.addEventListener('route-rendered', loadAsciinema);
