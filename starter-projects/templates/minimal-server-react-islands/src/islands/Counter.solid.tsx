/** @\jsx solid-js */
import { createSignal } from 'solid-js';

// console.log({ Pdsffffffffffff: P });

// console.log({ React });

export default function CounterSolid(params) {
	const [test, setTest] = createSignal(2);

	return (
		<>
			<h2>11 SOLID COUYNTER</h2>
			{JSON.stringify(params)}
			<details></details>
			SLOT:
			<slot />
			:SLOT ---
			<hr />
			{/* <CounterSolid2 /> */}
			{test}
			<button onClick={() => setTest(test() + 5)}>GO</button>
			<hr />
		</>
	);
}

// export function CounterSolid2(params) {
// 	const [a, b] = P.useState('KO');
// 	console.log('PRET');
// 	// P.useEffect(() => {});
// 	return (
// 		<>
// 			{a}
// 			{JSON.stringify(params)}
// 			--- PPPPREACT COUNTER
// 			<details></details>
// 			<button
// 				onClick={() => {
// 					b(Math.random().toString());
// 					console.log('OK');
// 				}}
// 			>
// 				DFDD
// 			</button>
// 		</>
// 	);
// }
