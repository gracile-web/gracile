import assert from 'node:assert/strict';
import test from 'node:test';

import { Signal } from 'signal-polyfill';

import {
	Functional,
	setSignalConstructor,
	WithFunctional,
	withFunctional,
} from './functional.js';
import {
	onCleanup,
	onMount,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from './hooks.js';
import { createContext } from './context.js';

export function renderHook<T>(
	function_: () => T,
	host: object = {},
): { result: T } {
	return { result: withFunctional(function_, host) };
}

await test('useState returns initial value and updates correctly', () => {
	assert.throws(
		() => {
			renderHook(() => {
				useState(0);
				return null;
			});
		},
		{ message: /No Signal constructor/ },
	);

	// Now we set it up for other tests
	setSignalConstructor(Signal);
});

void test('useState returns initial value and updates correctly', () => {
	const { result } = renderHook(() => {
		const [count, setCount] = useState(1);
		setCount(2);
		return count;
	});

	assert.equal(result.get(), 2);
});

void test('useState maintains signal identity between renders on same host', () => {
	const host = {};
	let signalReference: unknown;

	// First render

	renderHook(() => {
		const [count] = useState(5);
		signalReference = count;
	}, host);

	// Second render on the same host
	const { result } = renderHook(() => {
		const [count] = useState(99); // initial is ignored after first
		return count;
	}, host);

	// ✅ Identity is preserved because the host is reused

	assert.strictEqual(result, signalReference);
});

void test('useState preserves order of multiple calls', () => {
	const { result } = renderHook(() => {
		const [a] = useState('a');
		const [b] = useState('b');
		return [a.get(), b.get()];
	});

	assert.deepEqual(result, ['a', 'b']);
});

void test('useEffect runs after render and cleanup can be tracked', async () => {
	let effectRan = false;
	let cleanedUp = false;

	renderHook(() => {
		useEffect(() => {
			effectRan = true;
			return () => (cleanedUp = true);
		});
	});

	await Promise.resolve(); // microtask flush

	assert.equal(effectRan, true);

	assert.equal(cleanedUp, false); // no unmount yet
});

void test('multiple effects all run after render', async () => {
	const hits: number[] = [];

	renderHook(() => {
		useEffect(() => {
			hits.push(1);
		});
		useEffect(() => {
			hits.push(2);
		});
	});
	await Promise.resolve();

	assert.deepEqual(hits, [1, 2]);
});

void test('useEffect throws outside of render context', () => {
	assert.throws(() => {
		useEffect(() => {});
	}, /useEffect\(\) called outside render/);
});

void test('useMemo returns computed value', () => {
	const { result } = renderHook(() => {
		const [a] = useState(2);
		const [b] = useState(3);
		const sum = useMemo(() => a.get() + b.get());
		return sum;
	});

	assert.equal(result.get(), 5);
});

void test('useMemo recomputes on signal update', () => {
	let sumReference: unknown;
	const host = {};

	renderHook(() => {
		const [a, setA] = useState(1);
		const [b] = useState(2);
		sumReference = useMemo(() => a.get() + b.get());
		setA(3);
	}, host);

	assert.equal((sumReference as Signal.State<unknown>).get(), 5);
});

void test('useCallback returns memoized function', () => {
	const { result } = renderHook(() => {
		const [count, setCount] = useState(0);
		const increment = useCallback(() => setCount(count.get() + 1));
		return { count, increment };
	});
	const { count, increment } = result;

	increment.get()();

	assert.equal(count.get(), 1);
});

void test('useCallback updates when captured signal changes', () => {
	let callbackReference: Signal.Computed<() => number> | undefined;

	renderHook(() => {
		const [a, setA] = useState(1);
		callbackReference = useCallback(() => a.get());

		assert.equal(callbackReference.get()(), 1);

		setA(42);
	});

	assert.equal(callbackReference!.get()(), 42);
});

const { Provider: ThemeProvider, use: useTheme } = createContext<
	'light' | 'dark'
>({ defaultValue: 'light' });

void test('useContext returns provided value', () => {
	let theme: Signal.State<'light' | 'dark'> | undefined;

	withFunctional(() =>
		ThemeProvider({
			children: () => {
				theme = useTheme();
				return null;
			},
		}),
	);

	assert.equal(theme?.get(), 'light');
});
void test('createContext returns undefined default value', () => {
	const { Provider: ProviderNoValue, use } = createContext();
	let value: Signal.State<unknown> | undefined;

	withFunctional(() =>
		ProviderNoValue({
			children: () => {
				value = use();
				return null;
			},
		}),
	);
	assert.equal(value?.get(), undefined);
});

void test('multiple providers isolate values', () => {
	const results: string[] = [];

	const { Provider: ThemeProviderA, use: useA } = createContext({
		defaultValue: 'a',
	});
	const { Provider: ThemeProviderB, use: useB } = createContext({
		defaultValue: 'b',
	});

	withFunctional(() => {
		ThemeProviderA({
			children: () => {
				results.push(useA().get());
				ThemeProviderB({
					children: () => results.push(useB().get()),
				});
				return null;
			},
		});
	});

	assert.deepEqual(results, ['a', 'b']);
});

void test('context is inherited through FunctionalComponents', () => {
	let value;
	const { Provider: ContextProvider, use: useContext } = createContext({
		defaultValue: 'inherited',
	});

	withFunctional(() =>
		ContextProvider({
			children: () =>
				WithFunctional({
					children: () => {
						value = useContext().get();
					},
				}),
		}),
	);

	assert.equal(value, 'inherited');
});

void test('context default from provider component is overriding context default', () => {
	let value;
	const { Provider: ContextProvider, use: useContext } = createContext({
		defaultValue: 'context default',
	});

	withFunctional(() =>
		ContextProvider({
			value: 'default from provider component',
			children: () => {
				value = useContext().get();
			},
		}),
	);
	assert.equal(value, 'default from provider component');
});

void test('fallback default context is used', () => {
	const { use: useAnon } = createContext({ defaultValue: 'default' });
	const { result } = renderHook(() => useAnon());

	assert.equal(result.get(), 'default');
});

void test('onMount executes after render', async () => {
	let mounted = false;

	renderHook(() => {
		onMount(() => {
			mounted = true;
		});
	});
	await Promise.resolve();

	assert.equal(mounted, true);
});

void test('onCleanup queues a cleanup function', async () => {
	let cleaned = false;

	renderHook(() => {
		onCleanup(() => {
			cleaned = true;
		});
	});
	await Promise.resolve(); // will not flush cleanup, just ensure no throw

	assert.equal(cleaned, false); // no automatic unmount yet
});

void test('two render hosts keep signals isolated', () => {
	const hostA = {};
	const hostB = {};

	const a = renderHook(() => useState('A')[0], hostA).result;
	const b = renderHook(() => useState('B')[0], hostB).result;

	assert.notStrictEqual(a, b);

	assert.equal(a.get(), 'A');

	assert.equal(b.get(), 'B');
});

void test('useReducer initializes and dispatches correctly', () => {
	const { result } = renderHook(() => {
		return useReducer((state: number, action: 'inc' | 'dec') => {
			if (action === 'inc') return state + 1;
			if (action === 'dec') return state - 1;
			return state;
		}, 0);
	});

	const [state, dispatch] = result;

	assert.equal(state.get(), 0);

	dispatch('inc');
	assert.equal(state.get(), 1);

	dispatch('dec');
	assert.equal(state.get(), 0);
});

void test('Functional mixin injects render context correctly', () => {
	class DummyBase {
		render(): unknown {
			const [count, setCount] = useState(123);
			setCount(456);
			return count;
		}
	}

	// The mixin wraps DummyBase and injects `withFunctional` into its `render()`
	const Component = Functional(DummyBase);

	let result: Signal.State<number> | undefined;

	renderHook(() => {
		const instance = new Component();
		const returned = instance.render();
		if (returned instanceof Signal.State) result = returned;
	});

	assert.equal(result!.get(), 456);
});
