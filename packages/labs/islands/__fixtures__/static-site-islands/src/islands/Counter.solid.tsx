/** @jsxImportSource solid-js */

import { createSignal } from 'solid-js';

export default function CounterSolid() {
	const [count, setCount] = createSignal(0);

	return (
		<div data-island="solid">
			<h3>Island: Solid</h3>
			<p class="island-status">Solid SSR OK</p>
			<p>Count: {count()}</p>
			<button onClick={() => setCount((c) => c + 1)}>+1</button>
		</div>
	);
}
