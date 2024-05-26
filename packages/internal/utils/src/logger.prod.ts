/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck TODO: Implement stubs

import type { Logger } from 'vite';

export const logger: Logger = {
	info(msg: string, options?: LogOptions): void {
		// throw new Error('Function not implemented.');
	},
	warn(msg: string, options?: LogOptions): void {
		// throw new Error('Function not implemented.');
	},
	warnOnce(msg: string, options?: LogOptions): void {
		// throw new Error('Function not implemented.');
	},
	error(msg: string, options?: LogErrorOptions): void {
		// throw new Error('Function not implemented.');
	},
	clearScreen(type: LogType): void {
		// throw new Error('Function not implemented.');
	},
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	hasErrorLogged(error: Error | RollupError): boolean {
		// throw new Error('Function not implemented.');
	},
	hasWarned: false,
};
