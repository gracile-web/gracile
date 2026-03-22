/**
 * Guards from condition that are impossible to occurs from userland.
 * For example, a render host is always supposed to be present, but we have to
 * please TS and code coverage.
 */
export function guard<T = undefined>(message: string, item: T): NonNullable<T> {
	/* c8 ignore next */
	if (!item) throw new Error(message, { cause: item });

	return item;
}
