/**
 * @license ISC
 * @author Julian Cataldo
 */
export class Prefetcher {
	#prefetched = new Set<string>();

	get prefetched() {
		return this.#prefetched;
	}

	static readonly DATA_LINK_ATTRIBUTE_NAME = 'data-prefetch-document';
	static readonly DATA_ANCHOR_ATTRIBUTE_NAME = 'data-prefetch';

	public prefetch(href: string) {
		if (this.prefetched.has(href)) return;

		let link = document.querySelector<HTMLLinkElement>(
			`link[${Prefetcher.DATA_LINK_ATTRIBUTE_NAME}]`,
		);

		if (link === null) {
			link = document.createElement('link');
			link.rel = 'prefetch';
			link.as = 'document';
			link.setAttribute(Prefetcher.DATA_LINK_ATTRIBUTE_NAME, '');
			document.head.append(link);
		}

		link.href = href;

		this.prefetched.add(href);
	}

	#aborter = new AbortController();

	collectLinks() {
		// Clean previously set listeners
		this.#aborter.abort();
		this.#aborter = new AbortController();

		const links = document.querySelectorAll<HTMLAnchorElement>(
			`a[${Prefetcher.DATA_ANCHOR_ATTRIBUTE_NAME}]`,
		);

		for (const link of links) {
			link.addEventListener(
				'mouseenter',
				(event) => this.prefetch((event.target as HTMLAnchorElement).href),
				{ signal: this.#aborter.signal },
			);
			link.addEventListener(
				'focusin',
				(event) => this.prefetch((event.target as HTMLAnchorElement).href),
				{ signal: this.#aborter.signal },
			);
		}
	}
}
