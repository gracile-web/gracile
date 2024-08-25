/* eslint-disable no-console */
import type { LogErrorOptions, Logger, LogOptions, LogType } from 'vite';

export const loggerSymbol = Symbol('logger');

export class GracileLogger implements Logger {
	hasWarned = false;

	// eslint-disable-next-line class-methods-use-this
	info(msg: string, _options?: LogOptions): void {
		console.info(msg);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	warn(msg: string, _options?: LogOptions): void {
		console.warn(msg);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	warnOnce(msg: string, _options?: LogOptions): void {
		console.warn(msg);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	error(msg: string, _options?: LogErrorOptions): void {
		console.error(msg);
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
