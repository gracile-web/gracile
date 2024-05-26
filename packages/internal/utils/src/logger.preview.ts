/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck TODO: Implement stubs

import type { Logger } from 'vite';

export const logger: Logger = {
	info(msg: string, options?: LogOptions): void {
		console.info(msg, options);
	},
	warn(msg: string, options?: LogOptions): void {
		console.warn(msg, options);
	},
	warnOnce(msg: string, options?: LogOptions): void {
		console.warn(msg, options);
	},
	error(msg: string, options?: LogErrorOptions): void {
		console.error(msg, options);
	},
	clearScreen(type: LogType): void {
		console.clear();
	},
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	hasErrorLogged(error: Error | RollupError): boolean {
		console.error(error);
	},
	hasWarned: false,
};
