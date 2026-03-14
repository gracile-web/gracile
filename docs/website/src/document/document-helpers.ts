import { html } from 'lit';

export const googleAnalytics = html`<!-- Google tag (gtag.js) -->
	<script
		async
		src="https://www.googletagmanager.com/gtag/js?id=G-4NJYY802RL"
	></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-4NJYY802RL');
	</script>`;

// <!-- DEPRECATED? -->
// <!-- <link
//   rel="mask-icon"
//   href="/favicons/safari-pinned-tab.svg"
//   color="#119ee2"
// /> -->
export const favicon = html`
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="icon" href="/favicon.ico" sizes="any" />
	<meta name="theme-color" content="#119ee2" />
`;

export const requestIdleCallbackPolyfill = html` <script>
	window.requestIdleCallback =
		window.requestIdleCallback ||
		function (cb) {
			var start = Date.now();
			return setTimeout(function () {
				cb({
					didTimeout: false,
					timeRemaining: function () {
						return Math.max(0, 50 - (Date.now() - start));
					},
				});
			}, 1);
		};

	window.cancelIdleCallback =
		window.cancelIdleCallback ||
		function (id) {
			clearTimeout(id);
		};
</script>`;

// NOTE: BAD API, this will import Node specific stuff and break CSR
// import { pagePathToOgPath } from 'og-images-generator/api';
// WORKAROUND, inline this here until upstream is fixed.

/* export */ const DEFAULT_OG_PATH_PREFIX = '/og/';
export function pagePathToOgPath(
	pathName: string,
	pathPrefix = DEFAULT_OG_PATH_PREFIX,
) {
	return (
		pathPrefix.slice(0, -1) +
		(pathName === '/' ? '/index.png' : pathName.replace(/\/$/, '') + '.png')
	);
}
