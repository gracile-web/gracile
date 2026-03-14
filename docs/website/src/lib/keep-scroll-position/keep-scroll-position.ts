function saveScrollPosition(position: number, elemName: string) {
  sessionStorage.setItem(
    `gracile-keep-scroll-position--${elemName}`,
    position.toString(),
  );
}
const saveScrollPositionThrottled = throttle(saveScrollPosition, 25);

document
  .querySelectorAll<HTMLElement>('[data-keep-scroll-name]')
  .forEach((element) => {
    const keepScrollName = element.dataset.keepScrollName!;
    element.addEventListener('scroll', (event) => {
      const { scrollTop } = event.target as HTMLElement;

      saveScrollPositionThrottled(scrollTop, keepScrollName);
    });
  });

function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): T {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(
        () => {
          lastCall = Date.now();
          timeoutId = null;
          func(...args);
        },
        delay - (now - lastCall),
      );
    }
  } as T;
}
