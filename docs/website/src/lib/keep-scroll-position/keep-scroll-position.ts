function saveScrollPosition(position: number, elementName: string) {
	sessionStorage.setItem(
		`gracile-keep-scroll-position--${elementName}`,
		position.toString(),
	);
}
const saveScrollPositionThrottled = throttle(saveScrollPosition, 25);

for (const element of document.querySelectorAll<HTMLElement>(
	'[data-keep-scroll-name]',
)) {
	const keepScrollName = element.dataset.keepScrollName!;
	element.addEventListener('scroll', (event) => {
		const { scrollTop } = event.target as HTMLElement;

		saveScrollPositionThrottled(scrollTop, keepScrollName);
	});
}

function throttle<T extends (...arguments_: any[]) => void>(
	function_: T,
	delay: number,
): T {
	let lastCall = 0;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return function (...arguments_: Parameters<T>): void {
		const now = Date.now();

		if (now - lastCall >= delay) {
			lastCall = now;
			function_(...arguments_);
		} else if (!timeoutId) {
			timeoutId = setTimeout(
				() => {
					lastCall = Date.now();
					timeoutId = null;
					function_(...arguments_);
				},
				delay - (now - lastCall),
			);
		}
	} as T;
}
