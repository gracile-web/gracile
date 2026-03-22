/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Signal } from 'signal-polyfill';

import { guard } from './utils.js';
import { debug, trackSignal } from './debug.js';
import { functionalState } from './functional.js';

/**
 * Functional hook for managing state, tied to the current render host.
 * Returns a tuple of `[state, setState]`, like React.
 *
 * ⚠️ Must be called in the same order on every render.
 */
export function useState<T>(initial: T): [Signal.State<T>, (value: T) => void] {
	const host = guard(
		'useState() called outside render',
		functionalState.currentRenderElement,
	);

	let store = functionalState.storeMap.get(host);
	if (!store) {
		store = [];
		functionalState.storeMap.set(host, store);
	}

	const index = functionalState.indexMap.get(host)!;
	functionalState.indexMap.set(host, index + 1);

	if (!store[index]) {
		store[index] = new functionalState.Signal.State(initial);
		trackSignal(host, store[index]);
		debug(`[useState] create signal at index ${index}`, initial);
	}

	const sig = store[index];
	return [
		sig as Signal.State<T>,
		(v: T) => {
			debug(`[useState] set signal at index ${index}`, v);
			sig.set(v);
		},
	];
}

/**
 * Memoizes a function reactively.
 * Equivalent to `useMemo(() => fn)`, but communicates intent.
 *
 * ⚠️ Must be called in render scope.
 *
 * @example
 * const [count, setCount] = useState(0);
 * const increment = useCallback(() => setCount(count.get() + 1));
 *
 * <button on:click={increment.get()}>Increment</button>
 */
export function useCallback<T extends (...arguments_: any[]) => any>(
	function_: T,
): Signal.Computed<T> {
	guard(
		'useCallback() called outside render',
		functionalState.currentRenderElement,
	);

	return new functionalState.Signal.Computed(() => function_);
}

/**
 * Memoizes the result of a computed value reactively.
 * This is just sugar over `Signal.Computed`.
 *
 * ⚠️ Must be called in render scope.
 */
export function useMemo<T>(function_: () => T): Signal.Computed<T> {
	guard(
		'useMemo() called outside render',
		functionalState.currentRenderElement,
	);

	return new functionalState.Signal.Computed(function_);
}

/**
 * Creates a state signal that is updated via a reducer function.
 * Useful for managing complex state logic or action-based state updates.
 *
 * ⚠️ Must be called in render scope.
 *
 * @param reducer - A function that takes the current state and an action, and returns the new state.
 * @param initialState - The initial state value.
 * @returns A tuple: `[state, dispatch]`.
 *
 * @example
 * const [count, dispatch] = useReducer((state, action) => {
 *   switch (action.type) {
 *     case 'inc': return state + 1;
 *     case 'dec': return state - 1;
 *     default: return state;
 *   }
 * }, 0);
 *
 * <button on:click={() => dispatch({ type: 'inc' })}>Increment</button>
 */
export function useReducer<S, A>(
	reducer: (state: S, action: A) => S,
	initial: S,
): [Signal.State<S>, (action: A) => void] {
	const [state] = useState(initial);
	const dispatch = (action: A) => state.set(reducer(state.get(), action));
	return [state, dispatch];
}

/**
 * Functional lifecycle hook.
 * Queues a side effect that will run after render.
 * If a cleanup function is returned, it will be saved for later reuse.
 *
 * ⚠️ Effects are only flushed once per render frame.
 */
export function useEffect(function_: () => void | (() => void)) {
	const host = guard(
		'useEffect() called outside render',
		functionalState.currentRenderElement,
	);

	let effects = functionalState.effectMap.get(host);
	if (!effects) {
		effects = [];
		functionalState.effectMap.set(host, effects);
	}

	effects.push({
		run: () => {
			const cleanup = function_();
			const previous = effects.at(-1);
			if (typeof cleanup === 'function' && previous) {
				previous.cleanup = cleanup;
			}
		},
	});
}

/**
 * Runs an effect once after mount.
 * Sugar over `useEffect()` with no cleanup.
 */
export function onMount(function_: () => void) {
	useEffect(() => {
		function_();
	});
}

/**
 * Runs a cleanup once after unmount.
 * Sugar over `useEffect(() => fn)`.
 */
export function onCleanup(function_: () => void) {
	useEffect(() => function_);
}
