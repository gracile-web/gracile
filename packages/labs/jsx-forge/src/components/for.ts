/**
 * Stub component replaced at compile-time by a `repeat()` directive.
 */

import type { JSX } from '../jsx-namespace.js';

export function For<
	ArrayType extends unknown[],
	Key = ArrayType[number],
	KeyProvider = (item: Key) => unknown,
>(
	options: (Key extends JSX.Key
		? { key?: KeyProvider }
		: { key: KeyProvider }) & {
		each: ArrayType;
		'inner:children': (item: Key, index: number) => JSX.TemplateElement;
	},
): JSX.TemplateElement {
	throw new Error(
		'Your not supposed to used this directly. This component is handled at compile-time only.',
	);
}
