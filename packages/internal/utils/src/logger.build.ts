/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck TODO: Implement stubs

import type { Logger } from 'vite';

const NOT_PROD = process.env.NODE_ENV !== 'production';

export const logger: Logger = {
	info(msg: string, options?: LogOptions): void {
		if (NOT_PROD) console.info(msg);
	},
	warn(msg: string, options?: LogOptions): void {
		if (NOT_PROD) console.warn(msg);
	},
	warnOnce(msg: string, options?: LogOptions): void {
		if (NOT_PROD) console.warn(msg);
	},
	error(msg: string, options?: LogErrorOptions): void {
		if (NOT_PROD) console.error(msg);
	},
	clearScreen(type: LogType): void {
		if (NOT_PROD) console.clear();
	},
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	hasErrorLogged(error: Error | RollupError): boolean {
		if (NOT_PROD) console.error(error);
	},
	hasWarned: false,
};
