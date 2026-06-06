import { html } from 'lit';

export const navCurrentPageCritical = html`
	<!--  -->
	<script>
		const normalizePath = (pathname) =>
			pathname.length > 1 ? pathname.replace(/\\/$/, '') : pathname;

		const navTree = document.querySelector('.m-nav-tree');
		const currentLink = navTree
			? [...navTree.querySelectorAll('a[href]')].find(
					(link) =>
						normalizePath(new URL(link.href, window.location.href).pathname) ===
						normalizePath(window.location.pathname),
				)
			: null;

		if (navTree && currentLink) {
			const navTreeRect = navTree.getBoundingClientRect();
			const currentLinkRect = currentLink.getBoundingClientRect();
			const isOutsideScrollport =
				currentLinkRect.top < navTreeRect.top ||
				currentLinkRect.bottom > navTreeRect.bottom;

			if (isOutsideScrollport) {
				const topInset = Number.parseFloat(getComputedStyle(navTree).fontSize);

				navTree.scrollTo({
					top:
						navTree.scrollTop +
						currentLinkRect.top -
						navTreeRect.top -
						topInset,
				});
			}
		}
	</script>
`;
