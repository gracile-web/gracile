/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
import { customElement, property } from 'lit/decorators.js';
// import { } from 'solid-js/jsx-runtime';

import { bind, createPragma } from './lib.ts';

// your template literal library of choice
import { render, /* html, */ LitElement } from 'lit';

import {
	watch,
	signal,
	html,
	type Signal,
	computed,
} from '@lit-labs/preact-signals';
// import type { HTMLAttributes } from 'react';
import type * as Solid from 'solid-js';

const count = signal(0);

console.log(html(['dd'], 'a'));

// this module utils

// create your `h` / pragma function
// const h = createPragma(html);
const pppp = createPragma((strings, ...values) => {
	// return String.raw({ raw: strings } /* ...values */);
	const vvvv = html(strings, ...values);
	Reflect.set(vvvv.strings, 'hasOwnProperty', (key: string) => key === 'raw');

	return vvvv;
});
// if your env works already with `React.createElement`, use:
const React = { createElement: pppp };

// any component (passed as template value)
const Bold = ({ children }: { children: string }) => html`
	<strong>${children}</strong>dd
	<hr />
	${count}
	<hr />
`;

// const classList = computed(() => `${count}-a`);

//
const Bold2 = ({ children, c }: { children: string; c: Signal<number> }) => (
	<>
		<strong
			onClick={() => {
				console.log('object');
			}}
		>
			{children}
		</strong>

		<h1
			onClick={() => {
				console.log('heyy');
			}}
			class={computed(() => `${count}-a`)}
		>
			{count}
			hello
		</h1>
		<div></div>
	</>
);

// any generic value
const test = 123;

@customElement('lala-la')
export class MainZ extends LitElement {
	// static styles == [styles];

	/**
	 * Do  stuff
	 */
	@property({ type: Object, attribute: false }) count: Signal | null = null;

	render() {
		console.log(this.count);
		return (
			<button
				onClick={() => {
					console.log('ésdssd');
					// this.count++;
					count.value = count.value + 1;
				}}
			>
				LSLDLSD
				{this.count}
			</button>
		);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lala-la': MainZ;
	}
}

let stuff = 2;
// test it!
const myDocument = (test3: string) => (
	<p
		class="what"
		// title={bind(test)}

		onClick={(event) => {
			console.log(event.currentTarget);
			stuff++;
		}}
	>
		{stuff}
		<Bold>Hello</Bold>, <input type="password" disabled={false} />
		<Bold2 c={count}>Hello</Bold2>, <input type="password" disabled={false} />
		{test3}
		<span id="greetings">Hello</span>
		{count}
		{/* s */}
		{/* s  */}
		<lala-la prop:count={count}></lala-la>
		<input></input>
	</p>
);

declare global {
	interface HTMLElementTagNameMap {
		'lala-la': MainZ;
	}
}

console.log({
	myDocument: myDocument(),
	Bold: html`<strong>${'children'}</strong>`,
});

const myDocument2 = (test3: string, coun: Signal) => (
	<p
		onClick={(event) => {
			console.log({ ddd: event.currentTarget });
			// stuff++;
		}}
	>
		hello
		{test3}
		{'ss'}
		{coun}
		<Bold>Hello</Bold>, <input type="password" disabled={false} />
		{<div>addda</div>}
		<lala-la prop:count={count}></lala-la>
		<hr />
		<Bold2></Bold2>
		ss
	</p>
);

const t = myDocument2('aqdffqsdaa', count);
const b = html`test${'z'}`;

// Reflect.set(t.strings, 'hasOwnProperty', (key: string) => {
// 	if (key === 'raw') return true;
// 	return key in t.strings;

// 	// return false;
// 	// return t.strings.hasOwnProperty(key);
// });

// console.log({
// 	t,
// 	b,
// 	//
// 	tH: t.strings.hasOwnProperty('raw'),
// 	tH2: t.strings.hasOwnProperty('raw2'),
// 	bH: b.strings.hasOwnProperty('raw'),
// });

// // t.hasOwnProperty = () => {
// // 	return true;
// // };
// console.log({ t });

// console.log({ ddd: t.hasOwnProperty('raw') });

// console.log({ dd2d: b });
// console.log({ t });

render(t, document.body);

// console.log(myDocument('sss'));
// effect triggers console log "odd"
// effect triggers console log "even"
// effect triggers console log "odd"
// ...

// Global TypeScript support for properties in
// all declared Custom Elements (not just JSFE)
declare module 'solid-js' {
	namespace JSX {
		// type Element = Signal;
		type ElementProps<T> = {
			// Add both the element's prefixed properties and the attributes
			[K in keyof T]: Props<T[K]> & HTMLAttributes<T[K]>;
		};
		// Prefixes all properties with `prop:` to match Solid's property setting syntax
		type Props<T> = {
			[K in keyof T as `prop:${string & K}`]?: T[K];
		};
		interface IntrinsicElements extends ElementProps<HTMLElementTagNameMap> {}
	}
}

// (myDocument.strings as []).s;
// myDocument.strings;

// <p class="what" test="123"><strong>Hello</strong>, <input type="password"><span id="greetings">Hello</span></p>

// import { Signal } from 'signal-polyfill';
// // import { effect } from "./effect.js";

// const counter = new Signal.State(0);
// const isEven = new Signal.Computed(() => (counter.get() & 1) == 0);
// const parity = new Signal.Computed(() => (isEven.get() ? 'even' : 'odd'));

// effect(() => console.log(parity.get())); // Console logs "even" immediately.
// setInterval(() => counter.set(counter.get() + 1), 1000); // Changes the counter every 1000ms.

// console.log(globalThis.trustedTypes);
// globalThis.trustedTypes=null

// globalThis.trustedTypes.removePolicy('lit-html');
// render(unsafeHTML(['dd'], 'a'), document.body);
