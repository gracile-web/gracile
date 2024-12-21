/**
 * Resolve environment from Node export conditions.
 *
 * @example
 *
 * ```ts twoslash
 * // @filename: /src/lib/my-lib.ts
 *
 * import { nodeCondition } from '@gracile/gracile/node-condition';
 *
 * if (nodeCondition.BROWSER) {
 *   // NOTE: Do stuff…
 * }
 * ```
 */
export const nodeCondition = Object.freeze({
	BROWSER: false as boolean,
	DEV: false as boolean,
	PREVIEW: false as boolean,
	TEST: false as boolean,
});
