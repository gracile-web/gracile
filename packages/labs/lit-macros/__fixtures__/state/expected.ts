import { LitElement, html } from 'lit';

class MyCounter extends LitElement {
	static properties = {
		_value: {state: true},
		_threshold: {state: true, hasChanged: (n: number, o: number) => Math.abs(n - o) > 1},
	};

	constructor() {
		super();
		this._value = 0;
		this._threshold = 10;
	}

	render() {
		return html`<span>${this._value}</span>`;
	}
}
customElements.define('my-counter', MyCounter);
