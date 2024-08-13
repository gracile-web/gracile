/**
 * Resolve environment from Node export conditions.
 *
 * @example
 *
 * ```ts twoslash
 * // @filename: /src/lib/my-lib.ts
 *
 * import { env } from '@gracile/gracile/env';
 *
 * if (env.BROWSER) {
 *   // NOTE: Do stuff…
 * }
 * ```
 */
export const env = Object.freeze({
	BROWSER: false as boolean,
	DEV: false as boolean,
	PREVIEW: false as boolean,
	TEST: false as boolean,
});
