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
	throttle(
		() =>
			tocHeadings?.forEach((tocHeading) => {
				const top = tocHeading.getBoundingClientRect().top;
				if (top >= TOP_OFFSET) return;

				const id =
					tocHeading.getAttribute('id') ||
					tocHeading.getAttribute('href')?.slice(1);

				tocSelector?.forEach((toc) => {
					const foundId = toc.getAttribute('href')?.replace(/^#/, '');

					if (toc instanceof HTMLAnchorElement && foundId === id)
						toc.setAttribute('data-toc-active', '');
					else toc.removeAttribute('data-toc-active');
				});
			}),
		50,
	),
);
