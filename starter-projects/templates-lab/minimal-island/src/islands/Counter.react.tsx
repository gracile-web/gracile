/** @jsxImportSource react */

import { useState } from 'react';

export default function CounterReact() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<h3>React Counter</h3>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>
			<button onClick={() => setCount(0)}>Reset</button>
		</div>
	);
}
