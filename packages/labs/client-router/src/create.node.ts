import type { GracileRouterConfig } from './create.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createRouter(_config?: GracileRouterConfig): EventTarget {
	const dummyServerRouter = new EventTarget();

	return dummyServerRouter;
}
