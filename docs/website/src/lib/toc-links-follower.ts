import throttle from 'lodash.throttle';

import { router } from './router.js';

const TOP_OFFSET = 50;

let tocSelector: NodeListOf<Element> | null = null;
let tocHeadings: NodeListOf<Element> | null = null;

function collect() {
	tocSelector = document.querySelectorAll('[data-toc-selector]');
	tocHeadings = document.querySelectorAll('[data-toc]');
}

collect();
router.addEventListener('route-rendered', collect);

document.addEventListener(
	'scroll',
	throttle(() => {
		if (tocHeadings)
			for (const tocHeading of tocHeadings) {
				const top = tocHeading.getBoundingClientRect().top;
				if (top >= TOP_OFFSET) continue;

				const id =
					tocHeading.getAttribute('id') ||
					tocHeading.getAttribute('href')?.slice(1);

				if (tocSelector)
					for (const toc of tocSelector) {
						const foundId = toc.getAttribute('href')?.replace(/^#/, '');

						if (toc instanceof HTMLAnchorElement && foundId === id)
							toc.setAttribute('data-toc-active', '');
						else toc.removeAttribute('data-toc-active');
					}
			}
	}, 50),
);
