import { createLogger } from 'vite';

import { loggerSymbol } from './logger.js';

export function createGracileViteLogger() {
	const logger = createLogger(undefined, { prefix: '[gracile]' });
	// @ts-expect-error ...............
	globalThis[loggerSymbol] = logger;
	return logger;
}
