import '../features/my-greetings.js';

import { defineRoute } from '@gracile/gracile/route';
import { renderLight } from '@lit-labs/ssr-client/directives/render-light.js';
import { html, isServer, LitElement } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
// import '@gracile/gracile/_exp';
import { unsafeStatic } from 'lit/static-html.js';

import { v } from '../../islands.config.js';
// import { ref } from 'lit/directives/ref.js';
import { document } from '../document.js';
// import { SomeComp } from './_some-comp.js';

// import ReactDOMServer from 'react-dom/server';
// import ReactDOM from 'react-dom/client';
// import { unsafeHTML } from 'lit/directives/unsafe-html.js';
// import { html as sshtml } from 'lit/static-html.js';

console.log('HELLO', v());

// function ReactStaticIsland({ children }: { children: () => JSX.Element }) {
// 	if (!isServer) {
// 		class IslandReact extends HTMLElement {
// 			static tagName = 'island-react';

// 			#shadow;
// 			constructor() {
// 				super();
// 				// if (!this.shadowRoot) throw new Error('');
// 				// this.#shadow = this.shadowRoot;
// 			}
// 			connectedCallback() {
// 				ReactDOM.hydrateRoot(this, children());
// 			}
// 		}

// 		if (!customElements.get(IslandReact.tagName))
// 			customElements.define(IslandReact.tagName, IslandReact);
// 	}
// 	// let res = '';
// 	if (isServer) {
// 		// return html`
// 		// 	<!--  -->
// 		// 	<div>ISLAND</div>
// 		const res = ReactDOMServer.renderToString(children());
// 		return html`<island-react>
// 			${unsafeHTML(`<template shadowrootmode="open">
//         <div>
//           ${res}
//         </div>
//           </template>`)}
// 		</island-react>`;
// 	} else {
// 		const res =
// 			globalThis.document.querySelector('island-react')?.shadowRoot?.innerHTML;

// 		console.log({ res });
// 		return html`<island-react>
// 			${unsafeHTML(`<template shadowrootmode="open">
//         <div>
//           ${res}
//         </div>
//           </template>`)}
// 		</island-react>`;
// 	}

// return pipe;

// console.log({ res });
// ${ref((el) => {
// 	if (isServer) return;

// 	// ReactDOM.hydrateRoot(el, children());
// })}
// `;
// }

export default defineRoute({
	handler: ({ url, locals }) => {
		return {
			// ...locals,
			query: url.searchParams.get('filter') || '…empty…',
			test: 'foo',
		};
	},

	document: (context) => document({ ...context, title: 'Gracile - Home' }),

	// ${unsafeHTML(`<hello-island light>`)} ${renderLight()}
	// ${unsafeHTML(`</hello-island>`)}
	template: ({ props }) =>
		/* 		<is-land load="CounterReact" props=${JSON.stringify({ name: 'Joe' })}>
		</is-land> */

		// <is-land load="CounterVue" props=${JSON.stringify({ name: 'Joe' })}>
		// </is-land>

		html`
			Heyssssss
			<!-- <react-island>Hey</react-island> -->

			<!-- <counter-island></counter-island> -->

			<!-- <hello-island data-foo="hey"></hello-island>
		<hello-island data-foo="hey"></hello-island>
		<hello-island data-foo="hey"></hello-island>
		<hello-island data-foo="hey"></hello-island> -->
			<!-- <hello-island>
			<div>Test</div>
			<div slot="hey">Test</div>
		</hello-island>
		 -->
			<!--
        -->

			<!-- 
        -->
			<!-- 
          -->
			<!-- 
            -->
			<section>
				1
				<is-land load="CounterReact"></is-land>
			</section>
			<section>
				2
				<is-land load="CounterVue"></is-land>
			</section>
			<section>
				3
				<is-land load="CounterSvelte"></is-land>
			</section>
			<section>
				4
				<is-land load="CounterSolid"></is-land>
			</section>
			<section>
				5
				<is-land load="CounterPreact"></is-land>
			</section>
			<!-- 
      -->

			<!-- <is-land load="hello" light>$ {renderLight()}</is-land> -->

			<!--  -->
			<!--
		<hello-island></hello-island>
		<hello-island></hello-island>
		<hello-island></hello-island> -->
			<hr />

			<!-- <div id="react-root"></div> -->

			<!-- $ {v()} -->

			<!--  -->
		`,
});

// <is-land load="CounterPreact" props=${JSON.stringify({ name: 'Joe' })}>
// </is-land>
// <is-land load="CounterReact" props=${JSON.stringify({ name: 'Joe' })}>
// </is-land>
/* <button
  @click=${() => {
    console.log('DD');
    console.log({ SomeComp });
    }}
    >
    GO
    </button>
    ${props?.test}
    
    <div>
<!--  -->
${ReactStaticIsland({ children: SomeComp })}
</div> */

/* 


	<is-land load="CounterPreact" props=${JSON.stringify({ name: 'Joe' })}>
			SLLOTREST
			<button
				@click=${() => {
					console.log('ssss');
				}}
			>
				LIT
			</button>


      
*/

// data-props=${JSON.stringify({ name: 'ssssssssssssfoo' })}
//     data-props=${JSON.stringify({ name: 'ssssssssssssfoo' })}
// data-props=${JSON.stringify({ name: 'ssssssssssssfoo' })}

/* <is-land load="CounterVue"
			>SLOTVUE
			<button
				@click=${() => {
					console.log('ssss');
				}}
			>
				LIT
			</button>
		</is-land>
		<!-- <is-land load="hello2"> COUNTERSLOTER </is-land> -->
		<!-- SLOTTED props=$ {JSON.stringify({ name: 'FELIX' })} -->
		<button
			@click=${() => {
				console.log('ssss');
			}}
		>
			LIT
		</button> */
