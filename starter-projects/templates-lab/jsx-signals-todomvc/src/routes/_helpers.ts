// /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { nodeCondition } from '@gracile/internal-utils/condition';
// // import { GracileLogger } from '@gracile/internal-utils/logger/logger';
// import { Signal } from '@lit-labs/signals';

// // const { DEV } = nodeCondition;
// const log = console;

// const DEV = true

// /**
//  * Local hook state per render host.
//  * Shared across calls to `useState()` within the same render frame.
//  */
// const storeMap = new WeakMap<object, Signal.State<any>[]>();

// /**
//  * Tracks the currently active render host.
//  * Set temporarily during `withFunctional()`, and reset after.
//  */
// let currentRenderElement: object | null = null;

// /**
//  * Stack of context maps per render host.
//  * Each call to `provideContext()` pushes a new frame.
//  */
// const contextStackMap = new WeakMap<object, Map<symbol, Signal.State<any>>[]>();

// /**
//  * Queued effects to be executed after each render cycle.
//  */
// const effectMap = new WeakMap<
// 	object,
// 	Array<{ run: () => void; cleanup?: () => void }>
// >();

// /**
//  * Track the current index separately (React-like). Only used for `useState`.
//  */
// const indexMap = new WeakMap<object, number>();

// function debug(message: string, ...object: unknown[]) {
// 	/* c8 ignore next 2 */
// 	if (DEV) log.debug(message, ...object);
// }
// /**
//  * Guards from condition that are impossible to occurs from userland.
//  * For example, a render host is always supposed to be present, but we have to
//  * please TS and code coverage.
//  */
// function guard<T = undefined>(message: string, item: T): NonNullable<T> {
// 	/* c8 ignore next */
// 	if (!item) throw new Error(message, { cause: item });
// 	return item;
// }

// /**
//  * Core render boundary for functional components.
//  * - Resets state and context stacks
//  * - Ensures stable indexing of hooks
//  * - Flushes `useEffect` after render
//  *
//  * @param host - A unique identity for this component (usually `this` in a LitElement)
//  * @param renderFn - A function representing the component render
//  */
// export function withFunctional<T>(
// 	renderFunction: () => T,
// 	host: object = {},
// ): T {
// 	const previous = currentRenderElement;
// 	currentRenderElement = host;

// 	// Debug: track host finalization for dev observability + cleanup
// 	registerDebugFinalizers(host);

// 	// Reset hook index tracking
// 	indexMap.set(host, 0);

// 	// Reset context stack
// 	contextStackMap.set(host, []);

// 	try {
// 		const result = renderFunction();
// 		queueMicrotask(() => {
// 			const effects = effectMap.get(host);
// 			if (effects) {
// 				for (const effect of effects) effect?.run();
// 				effectMap.delete(host);
// 			}
// 		});
// 		return result;
// 	} finally {
// 		currentRenderElement = previous;
// 	}
// }

// /**
//  * Convenience wrapper JSX-y templates (e.g. Gracile ESX).
//  * If no host is passed, an internal object is created.
//  *
//  * @example
//  * ```tsx
//  * return (
//  *   <WithFunctional>
//  *     {() => (
//  *       <Child />
//  *     )}
//  *   </WithFunctional>
//  * )
//  * ```
//  */
// export function WithFunctional(properties: {
// 	host?: object;
// 	children: () => void;
// }) {
// 	return withFunctional(properties.children, properties.host);
// }

// /**
//  * Functional hook for managing state, tied to the current render host.
//  * Returns a tuple of `[state, setState]`, like React.
//  *
//  * ⚠️ Must be called in the same order on every render.
//  */
// export function useState<T>(initial: T): [Signal.State<T>, (value: T) => void] {
// 	const host = guard('useState() called outside render', currentRenderElement);

// 	let store = storeMap.get(host);
// 	if (!store) {
// 		store = [];
// 		storeMap.set(host, store);
// 	}

// 	const index = indexMap.get(host)!;
// 	indexMap.set(host, index + 1);

// 	if (!store[index]) {
// 		store[index] = new Signal.State(initial);
// 		trackSignal(host, store[index]);
// 		debug(`[useState] create signal at index ${index}`, initial);
// 	}

// 	const sig = store[index];
// 	return [
// 		sig as Signal.State<T>,
// 		(v: T) => {
// 			debug(`[useState] set signal at index ${index}`, v);
// 			sig.set(v);
// 		},
// 	];
// }

// /**
//  * Memoizes a function reactively.
//  * Equivalent to `useMemo(() => fn)`, but communicates intent.
//  *
//  * ⚠️ Must be called in render scope.
//  *
//  * @example
//  * const [count, setCount] = useState(0);
//  * const increment = useCallback(() => setCount(count.get() + 1));
//  *
//  * <button on:click={increment.get()}>Increment</button>
//  */
// export function useCallback<T extends (...arguments_: any[]) => any>(
// 	function_: T,
// ): Signal.Computed<T> {
// 	guard('useCallback() called outside render', currentRenderElement);

// 	return new Signal.Computed(() => function_);
// }

// /**
//  * Memoizes the result of a computed value reactively.
//  * This is just sugar over `Signal.Computed`.
//  *
//  * ⚠️ Must be called in render scope.
//  */
// export function useMemo<T>(function_: () => T): Signal.Computed<T> {
// 	guard('useMemo() called outside render', currentRenderElement);

// 	return new Signal.Computed(function_);
// }

// /**
//  * Creates a state signal that is updated via a reducer function.
//  * Useful for managing complex state logic or action-based state updates.
//  *
//  * ⚠️ Must be called in render scope.
//  *
//  * @param reducer - A function that takes the current state and an action, and returns the new state.
//  * @param initialState - The initial state value.
//  * @returns A tuple: `[state, dispatch]`.
//  *
//  * @example
//  * const [count, dispatch] = useReducer((state, action) => {
//  *   switch (action.type) {
//  *     case 'inc': return state + 1;
//  *     case 'dec': return state - 1;
//  *     default: return state;
//  *   }
//  * }, 0);
//  *
//  * <button on:click={() => dispatch({ type: 'inc' })}>Increment</button>
//  */
// export function useReducer<S, A>(
// 	reducer: (state: S, action: A) => S,
// 	initial: S,
// ): [Signal.State<S>, (action: A) => void] {
// 	const [state] = useState(initial);
// 	const dispatch = (action: A) => state.set(reducer(state.get(), action));
// 	return [state, dispatch];
// }

// /**
//  * Functional lifecycle hook.
//  * Queues a side effect that will run after render.
//  * If a cleanup function is returned, it will be saved for later reuse.
//  *
//  * ⚠️ Effects are only flushed once per render frame.
//  */
// export function useEffect(function_: () => void | (() => void)) {
// 	const host = guard('useEffect() called outside render', currentRenderElement);

// 	let effects = effectMap.get(host);
// 	if (!effects) {
// 		effects = [];
// 		effectMap.set(host, effects);
// 	}

// 	effects.push({
// 		run: () => {
// 			const cleanup = function_();
// 			const previous = effects.at(-1);
// 			if (typeof cleanup === 'function' && previous) {
// 				previous.cleanup = cleanup;
// 			}
// 		},
// 	});
// }

// /**
//  * Shape of an internally tracked context.
//  */
// export interface ContextKey<T> {
// 	id: symbol;
// 	default?: Signal.State<T> | undefined;
// }

// /**
//  * Creates a context key and optional default value.
//  * This is mostly an internal utility behind `createContextProvider`.
//  */
// function createContext<T>(defaultValue?: T, name?: string): ContextKey<T> {
// 	return {
// 		id: Symbol(name || 'Context'),
// 		default:
// 			defaultValue === undefined
// 				? undefined
// 				: (new Signal.State(defaultValue) as Signal.State<T>),
// 	};
// }

// /**
//  * Provides a context value inside the current render frame.
//  * Each call pushes a new frame, preserving prior contexts (for shadowing).
//  */
// export function provideContext<T>(key: ContextKey<T>, value: Signal.State<T>) {
// 	debug('[provideContext]', key.id, 'on host:', currentRenderElement);

// 	const host = guard(
// 		'provideContext() called outside render',
// 		currentRenderElement,
// 	);

// 	const stack = guard(
// 		'Invariant: context stack was not initialized',
// 		contextStackMap.get(host),
// 	);

// 	const previousFrame = stack.at(-1);
// 	const freshFrame = new Map(previousFrame ?? undefined);
// 	freshFrame.set(key.id, value);
// 	stack.push(freshFrame);
// }

// /**
//  * Retrieves the most recent context value for the given key.
//  * Falls back to the context default if no value was provided.
//  */
// function useContext<T>(key: ContextKey<T>): Signal.State<T> {
// 	const host = guard(
// 		'useContext() called outside render',
// 		currentRenderElement,
// 	);

// 	const stack = contextStackMap.get(host);
// 	const top = stack?.[stack.length - 1];

// 	if (top?.has(key.id)) return top.get(key.id) as Signal.State<T>;

// 	debug(`[context] using key ${String(key.id)} on host`, host);

// 	if (key.default) return key.default;

// 	/* c8 ignore next */ throw new Error(
// 		`No context value or default found for key ${String(key.id)}`,
// 	);
// }

// type ProviderComponent = (properties: { children: () => unknown }) => unknown;

// /**
//  * High-level API for defining context + provider + hook in one step.
//  *
//  * @example
//  * const [ThemeProvider, useTheme] = createContextProvider('light');
//  */
// export function createContextProvider<T>(
// 	defaultValue: T,
// 	name?: string,
// ): [ProviderComponent, () => Signal.State<T>] {
// 	const context = createContext<T>(defaultValue, name);

// 	const Provider: ProviderComponent = ({ children }) => {
// 		const signal = new Signal.State<T>(defaultValue);

// 		return withFunctional(() => {
// 			provideContext(context, signal);
// 			return children() as unknown;
// 		});
// 	};

// 	const use = () => useContext(context);

// 	return [Provider, use];
// }

// /**
//  * Runs an effect once after mount.
//  * Sugar over `useEffect()` with no cleanup.
//  */
// export function onMount(function_: () => void) {
// 	useEffect(() => {
// 		function_();
// 	});
// }

// /**
//  * Runs a cleanup once after unmount.
//  * Sugar over `useEffect(() => fn)`.
//  */
// export function onCleanup(function_: () => void) {
// 	useEffect(() => function_);
// }

// /**
//  * A class mixin that automatically wraps a Lit-style `render()` method with
//  * `withFunctional()`, allowing hooks like `useState` or `useContext` to
//  * functional templates without boilerplate.

//  * @template TBase - The base class with a `render()` method to be enhanced.
//  * @param Base - - Any class constructor (typically extending `LitElement` or similar).
//  * @returns A subclass with an enhanced `render()` method that scopes functional hooks.
//  * @example
//  * ```ts
//  * export class MyFunctionalElement extends SignalWatcher(Functional(LitElement)) { ... }
//  * ```
//  */
// export function Functional<
// 	TBase extends abstract new (...arguments_: any[]) => any,
// >(Base: TBase): TBase {
// 	abstract class C extends Base {
// 		render(): unknown {
// 			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
// 			return withFunctional(() => super.render());
// 		}
// 	}
// 	return C;
// }

// // Debug tools for REPL/Node tests/devtools.
// /* c8 ignore start */

// const globalSignalSet = new Set<Signal.State<any>>();

// const signalFinalizers = new FinalizationRegistry<Signal.State<any>>(
// 	(signal) => {
// 		globalSignalSet.delete(signal);
// 		debug('[Signal GC]', signal);
// 	},
// );
// function trackSignal(host: object, signal: Signal.State<any>) {
// 	if (DEV) {
// 		globalSignalSet.add(signal);
// 		signalFinalizers.register(host, signal);
// 	}
// }

// const debugFinalizers = new FinalizationRegistry<{ host: object; id: string }>(
// 	({ host, id }) => {
// 		debug(`[FinalizationRegistry] GC’d host ${id}`);
// 		// Actively clean all associated state
// 		storeMap.delete(host);
// 		contextStackMap.delete(host);
// 		effectMap.delete(host);
// 	},
// );

// function registerDebugFinalizers(host: object, id?: string) {
// 	if (!DEV) return;
// 	const _id = id || `anon@${Math.random().toFixed(6)}`;
// 	debugFinalizers.register(host, { host, id: _id });
// }

// if (DEV)
// 	(globalThis as any).__debugSignals = {
// 		getCurrentHost: () => currentRenderElement,
// 		getContextStack: () => contextStackMap.get(currentRenderElement!),
// 		getSignalStore: () => storeMap.get(currentRenderElement!),
// 		getGlobalSignalSet: () => [...globalSignalSet],
// 	};
// /* c8 ignore stop */

// // export { Signal } from 'signal-polyfill';
