import { when } from 'lit/directives/when.js';

export function Show({
	when: w,
	fallback,
	children,
}: {
	when: unknown;
	fallback?: unknown;
	children: unknown;
}) {
	return when(
		w,
		() => children,
		() => fallback,
	);
}
