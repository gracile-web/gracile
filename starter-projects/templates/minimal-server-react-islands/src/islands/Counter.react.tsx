/** @\jsx react-jsx */

import React, { useState, use } from 'react';

// console.log({ React });
console.log(React.version); // ← “18.2.0” (hard-coded in compat)
console.log(React.useId); // undefined until Preact 11
console.log({ use });

export default function CounterReact(params) {
	return (
		<>
			{/* {JSON.stringify(params)} */}
			<h2>111REACT COUNTER </h2>
			<details></details>
			SLOT:
			<slot />
			:SLOT ---
			<hr />
			<SubCh />
			<hr />
			{/* <button
				onClick={() => {
					console.log('OK');
				}}
			>
				CounterReact
			</button> */}
		</>
	);
}

export function SubCh(params) {
	const [a, setA] = useState('KO');
	console.log('PRET');
	// P.useEffect(() => {});
	return (
		<>
			{/* {JSON.stringify(params)} */}
			---
			<data>{a}</data>
			<details></details>
			<button
				onClick={() => {
					setA(Math.random().toString());
					console.log('OK');
				}}
			>
				DFDD
			</button>
		</>
	);
}
