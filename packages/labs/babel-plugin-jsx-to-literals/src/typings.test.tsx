import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

declare global {
	interface HTMLElementTagNameMap {
		'dum-my': Dummy;
	}
}
class Dummy extends LitElement {
	@property({ type: Object }) foo!: { bar: string };
}

const React = { createElement: () => {} };
const noop = (input: unknown) => input;

const MyElement = ({ children }: { children: JSX.LitTemplate }) => (
	<>{children}</>
);
const Tpl = (
	<>
		<MyElement>
			{() => null}
			{2}

			<div class:map={{ foo: true }}></div>
			<div style:map={{ color: 'rebeccapurple' }}></div>

			<input prop:checked={true} aria-activedescendant={'hey'}></input>
		</MyElement>
	</>
);

noop(Tpl);
