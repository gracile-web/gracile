/** @jsxImportSource react */

import { useState } from 'react';

export default function CounterReact() {
	const [count, setCount] = useState(0);

	return (
		<div data-island="react">
			<h3>Island: React</h3>
			<p className="island-status">React SSR OK</p>
			<p>Count: {count}</p>
			<button onClick={() => setCount((c) => c + 1)}>+1</button>
		</div>
	);
}
