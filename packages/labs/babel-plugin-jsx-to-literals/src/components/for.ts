/**
 * Stub component replaced at compile-time by a `repeat()` directive.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function For<T extends unknown[]>(_options: {
	each: T;
	children: (item: T[number], index: number) => JSX.LitTemplate;
}): JSX.LitTemplate {
	throw new Error('Your not supposed to used this directly (static only).');
}
