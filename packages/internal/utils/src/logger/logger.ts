/* eslint-disable no-console */
import type { LogErrorOptions, Logger, LogOptions, LogType } from 'vite';

export const loggerSymbol = Symbol('logger');

export class GracileLogger implements Logger {
	hasWarned = false;

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	info(message: string, _options?: LogOptions): void {
		console.info(message);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	warn(message: string, _options?: LogOptions): void {
		console.warn(message);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	warnOnce(message: string, _options?: LogOptions): void {
		console.warn(message);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	error(message: string, _options?: LogErrorOptions): void {
		console.error(message);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	clearScreen(type: LogType): void {
		console.clear();
	}

	// eslint-disable-next-line class-methods-use-this
	hasErrorLogged(error: Error | LogErrorOptions['error']): boolean {
		console.error(error);
		return true;
	}
}
