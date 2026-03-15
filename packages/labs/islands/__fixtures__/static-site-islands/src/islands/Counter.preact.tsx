/** @jsxImportSource preact */

import { useState } from 'preact/hooks';

export default function CounterPreact() {
	const [count, setCount] = useState(0);

	return (
		<div data-island="preact">
			<h3>Island: Preact</h3>
			<p className="island-status">Preact SSR OK</p>
			<p>Count: {count}</p>
			<button onClick={() => setCount((c) => c + 1)}>+1</button>
		</div>
	);
}
