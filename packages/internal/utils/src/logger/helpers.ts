import { GracileLogger, loggerSymbol } from './logger.js';

export function getLogger() {
	// @ts-expect-error ............
	const logger = globalThis[loggerSymbol] as GracileLogger | undefined;

	if (!logger) throw new ReferenceError('No logger.');
	return logger;
}

export function createLogger(instance?: GracileLogger) /* :  */ {
	// mode: keyof typeof modes = 'prod',
	const logger =
		// @ts-expect-error ............
		(globalThis[loggerSymbol] as GracileLogger) ||
		instance ||
		new GracileLogger();
	// @ts-expect-error ...........
	globalThis[loggerSymbol] = logger;
	return logger;
}
