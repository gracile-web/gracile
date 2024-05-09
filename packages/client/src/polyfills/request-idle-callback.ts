/* eslint-disable func-names */
// Taken from: https://github.com/pladaria/requestidlecallback-polyfill/blob/master/index.js

window.requestIdleCallback =
	window.requestIdleCallback ||
	function (cb) {
		const start = Date.now();
		return setTimeout(() => {
			cb({
				didTimeout: false,
				timeRemaining: () => {
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
