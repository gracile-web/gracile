import { createLogger } from 'vite';

import { loggerSymbol, type GracileLogger } from './logger.js';

export function createGracileViteLogger(): GracileLogger {
	const logger = createLogger(undefined, { prefix: '[gracile]' });
	// @ts-expect-error ...............
	globalThis[loggerSymbol] = logger;
	return logger;
}
