/** @\jsx preact */

import * as P from 'preact/hooks';

console.log({ Pdsffffffffffff: P });

// console.log({ React });

export default function CounterPreact(params) {
	return (
		<>
			<h2>PPPPREACT COUNTER 2</h2>
			{JSON.stringify(params)}
			<details></details>
			SLOT:
			<slot />
			:SLOT ---
			<hr />
			<CounterPreact2 />
			<hr />
		</>
	);
}

export function CounterPreact2(params) {
	const [a, b] = P.useState('KO');
	console.log('PRET');
	// P.useEffect(() => {});
	return (
		<>
			{a}
			{JSON.stringify(params)}
			---
			<details></details>
			<button
				onClick={() => {
					b(Math.random().toString());
					console.log('OK');
				}}
			>
				DFDD
			</button>
		</>
	);
}
