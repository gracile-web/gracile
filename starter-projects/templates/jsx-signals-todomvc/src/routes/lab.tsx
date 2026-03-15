'use html-signal';
import { defineRoute } from '@gracile/gracile/route';

import { document } from '../document.jsx';

import { isServer, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
	WithFunctional,
	Functional,

	// Signal,
	// } from './_helpers.js'
} from '@gracile-labs/functional';
import { signal, SignalWatcher, Signal as LitSignal } from '@lit-labs/signals';
import { createContext } from '@gracile-labs/functional/context';
import { onMount, useEffect, useState } from '@gracile-labs/functional/hooks';

const { Provider: ThemeProvider, use: useTheme } = createContext<
	'light' | 'dark'
>({
	defaultValue: 'light',
	name: 'Theme',
});

// console.log({ Signal, LitSignal }, Signal === LitSignal);

@customElement('lab-1')
export class Lab extends SignalWatcher(Functional(LitElement)) {
	override render() {
		return (
			<WithFunctional>
				{() => (
					<>
						LAB
						<hr />
						COMP: <Comp></Comp>
						<hr />
						<ThemeProvider>
							{() => (
								<>
									LALA: <Lala />
								</>
							)}
						</ThemeProvider>
					</>
				)}
			</WithFunctional>
		);
	}
}

// const s = signal('test11');

function Lala() {
	const theme = useTheme();

	console.log('[Lala] theme identity:', theme);

	return (
		<>
			{theme}

			<button
				on:click={() => {
					console.log('DARK');
					theme.set('dark');
				}}
			>
				dark
			</button>
			<button
				on:click={() => {
					console.log('LIGHT');
					theme.set('light');
				}}
			>
				light
			</button>

			<br></br>
		</>
	);
}

export default defineRoute({
	document: () => document({ title: 'Gracile - TodoMVC' }),

	template: () => (
		<WithFunctional>
			{() => (
				<>
					{/* <ThemeProvider>
						{() => (
							<>
								<Lala />
								<Lala />
								<ThemeProvider>
									{() => (
										<>
											<Lala />
											<Lala />
										</>
									)}
								</ThemeProvider>
							</>
						)}
					</ThemeProvider> */}

					{/* <hr /> */}
					<Lala />
					<Comp />
					{/* <ThemeProvider>
						{() => (
							<>
								<Lala />
								<lab-1 />
							</>
						)}
					</ThemeProvider> */}
				</>
			)}
		</WithFunctional>
	),
});

function Comp() {
	const [text, setText] = useState('KDFLFJD');

	const [width, setWidth] = useState(globalThis.window?.innerWidth || 0);

	const theme = useTheme();

	if (!isServer)
		useEffect(() => {
			const update = () => {
				console.log('hey');

				setWidth(window.innerWidth);
			};
			window.addEventListener('resize', update);

			console.log('[ResizeListener] attached');

			return () => {
				window.removeEventListener('resize', update);
				console.log('[ResizeListener] detached');
			};
		});

	onMount(() => {
		console.log('hello');
	});

	useEffect(() => {
		setTimeout(() => {
			setWidth(100);
		}, 0);
	});

	return (
		<>
			<p>Viewport width: {width}px</p>
			<hr />
			<hr />
			{theme}
			<hr />
			{text} Ola
			<button on:click={() => setText('Hey' + Math.random())}>RND</button>
		</>
	);
}

// function Lala2() {
// 	const theme = useContext(ThemeContext);
// 	return (
// 		<ThemeProvider>
// 			2222222222
// 			<hr />
// 			{theme}
// 			<button
// 				on:click={() => {
// 					theme.set('dark');
// 				}}
// 			>
// 				dark
// 			</button>
// 			<button
// 				on:click={() => {
// 					theme.set('light');
// 				}}
// 			>
// 				light
// 			</button>
// 		</ThemeProvider>
// 	);
// }
