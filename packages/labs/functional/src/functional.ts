/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Signal } from 'signal-polyfill';

import { initDebugging } from './debug.js';

/**
 * Injects a custom Signal constructor (e.g., from signal-polyfill).
 */
export function setSignalConstructor(ctor: typeof Signal) {
	FunctionalState.manualSignalCtor = ctor;
}

export type { FunctionalState };
class FunctionalState {
	/**
	 * Runtime injection for Signal constructor.
	 * Allows userland to bring their own reactive primitive (Lit, polyfill, etc.).
	 *
	 * Prefer global registration: `globalThis.Signal = Signal;`
	 * Or manual DI via `setSignalConstructor()`.
	 */
	public static manualSignalCtor:
		| typeof import('signal-polyfill').Signal
		| null = null;

	/**
	 * Local hook state per render host.
	 * Shared across calls to `useState()` within the same render frame.
	 */
	public readonly storeMap = new WeakMap<object, Signal.State<any>[]>();

	/**
	 * Tracks the currently active render host.
	 * Set temporarily during `withFunctional()`, and reset after.
	 */
	public currentRenderElement: object | null = null;

	/**
	 * Stack of context maps per render host.
	 * Each call to `provideContext()` pushes a new frame.
	 */
	public readonly contextStackMap = new WeakMap<
		object,
		Map<symbol, Signal.State<any>>[]
	>();

	/**
	 * Queued effects to be executed after each render cycle.
	 */
	public readonly effectMap = new WeakMap<
		object,
		Array<{ run: () => void; cleanup?: () => void }>
	>();

	/**
	 * Track the current index separately (React-like). Only used for `useState`.
	 */
	public readonly indexMap = new WeakMap<object, number>();

	/**
	 * Retrieves the active Signal constructor from DI or globalThis.
	 * Throws if no constructor is found — must be set before hooks run.
	 */
	public get Signal(): typeof Signal {
		return (
			FunctionalState.manualSignalCtor ??
			(globalThis as any).Signal ??
			this.#throwSignalSetupError()
		);
	}
	// eslint-disable-next-line class-methods-use-this
	#throwSignalSetupError(): never {
		throw new Error(
			'[gracile] No Signal constructor found.\n\n' +
				'You must:\n' +
				'• Install a compatible signal implementation (e.g. @lit-labs/signals)\n' +
				'• Inject it via `setSignalConstructor(Signal)`\n' +
				'  or assign globally: `globalThis.Signal = Signal`\n',
		);
	}
}

/** Singleton used accross the toolkit */
export const functionalState = new FunctionalState();

const { registerDebugFinalizers } = initDebugging(functionalState);

/**
 * Core render boundary for functional components.
 * - Resets state and context stacks
 * - Ensures stable indexing of hooks
 * - Flushes `useEffect` after render
 *
 * @param host - A unique identity for this component (usually `this` in a Custom Element)
 * @param renderFn - A function representing the component render
 */
export function withFunctional<T>(
	renderFunction: () => T,
	host: object = {},
): T {
	const previous = functionalState.currentRenderElement;
	functionalState.currentRenderElement = host;

	// Debug: track host finalization for dev observability + cleanup
	registerDebugFinalizers(host);

	// Reset hook index tracking
	functionalState.indexMap.set(host, 0);

	// Reset context stack
	functionalState.contextStackMap.set(host, []);

	try {
		const result = renderFunction();
		queueMicrotask(() => {
			const effects = functionalState.effectMap.get(host);
			if (effects) {
				for (const effect of effects) effect?.run();
				functionalState.effectMap.delete(host);
			}
		});
		return result;
	} finally {
		functionalState.currentRenderElement = previous;
	}
}

/**
 * Convenience wrapper JSX-y templates (e.g. Gracile ESX).
 * If no host is passed, an internal object is created.
 *
 * @example
 * ```tsx
 * return (
 *   <WithFunctional>
 *     {() => (
 *       <Child />
 *     )}
 *   </WithFunctional>
 * )
 * ```
 */
export function WithFunctional(properties: {
	host?: object;
	children: () => void;
}) {
	return withFunctional(properties.children, properties.host);
}

/**
 * A class mixin that automatically wraps a Lit-style `render()` method with
 * `withFunctional()`, allowing hooks like `useState` or `useContext` to
 * functional templates without boilerplate.

 * @template TBase - The base class with a `render()` method to be enhanced.
 * @param Base - - Any class constructor (typically extending `LitElement` or similar).
 * @returns A subclass with an enhanced `render()` method that scopes functional hooks.
 * @example
 * ```ts
 * export class MyFunctionalElement extends SignalWatcher(Functional(LitElement)) { ... }
 * ```
 */
export function Functional<
	TBase extends abstract new (...arguments_: any[]) => any,
>(Base: TBase): TBase {
	abstract class C extends Base {
		render(): unknown {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			return withFunctional(() => super.render());
		}
	}
	return C;
}
