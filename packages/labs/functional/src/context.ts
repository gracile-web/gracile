import type { Signal } from 'signal-polyfill';

import { functionalState, withFunctional } from './functional.js';
import { guard } from './utils.js';
import { debug } from './debug.js';

/**
 * Provides a context value inside the current render frame.
 * Each call pushes a new frame, preserving prior contexts (for shadowing).
 */
export function provideContext<T>(key: ContextKey<T>, value: Signal.State<T>) {
	debug(
		'[provideContext]',
		key.id,
		'on host:',
		functionalState.currentRenderElement,
	);

	const host = guard(
		'provideContext() called outside render',
		functionalState.currentRenderElement,
	);

	const stack = guard(
		'Invariant: context stack was not initialized',
		functionalState.contextStackMap.get(host),
	);

	const previousFrame = stack.at(-1);
	const freshFrame = new Map(previousFrame ?? undefined);
	freshFrame.set(key.id, value);
	stack.push(freshFrame);
}

/**
 * Retrieves the most recent context value for the given key.
 * Falls back to the context default if no value was provided.
 */
function useContext<T>(key: ContextKey<T>): Signal.State<T> {
	const host = guard(
		'useContext() called outside render',
		functionalState.currentRenderElement,
	);

	const stack = functionalState.contextStackMap.get(host);
	const top = stack?.[stack.length - 1];

	if (top?.has(key.id)) return top.get(key.id) as Signal.State<T>;

	debug(`[context] using key ${String(key.id)} on host`, host);

	if (key.default) return key.default;

	/* c8 ignore next */ throw new Error(
		`No context value or default found for key ${String(key.id)}`,
	);
}

type ProviderComponent<T> = (properties: {
	children: () => unknown;
	value?: T;
}) => unknown;

/**
 * High-level API for defining context + provider + hook in one step.
 *
 * @example
 * const { ThemeProvider } = createContextProvider();
 */
export function createContext<T>(
	options: {
		defaultValue?: T;
		name?: string;
	} = {},
): {
	Provider: ProviderComponent<T>;
	use: () => Signal.State<T>;
	context: ContextKey<T>;
} {
	const { defaultValue, name } = options;

	const context = createContextKey(defaultValue, name);

	const Provider: ProviderComponent<T> = ({ children, value }) => {
		const signal = new functionalState.Signal.State(value ?? defaultValue);

		return withFunctional(() => {
			provideContext(context, signal);
			return children() as unknown;
		});
	};

	const use = () => useContext<T>(context);

	return { Provider, use, context };
}

/**
 * Creates a context key and optional default value.
 * This is mostly an internal utility behind `createContextProvider`.
 */
function createContextKey<T>(defaultValue?: T, name?: string): ContextKey<T> {
	return {
		id: Symbol(name || 'Context'),
		default:
			defaultValue === undefined
				? undefined
				: (new functionalState.Signal.State(defaultValue) as Signal.State<T>),
	};
}
/**
 * Shape of an internally tracked context.
 */
export interface ContextKey<T> {
	id: symbol;
	default?: Signal.State<T> | undefined;
}
