import { LitElement, html } from 'lit';

class MyGreeting extends LitElement {
	static properties = {
		name: {type: String},
		_count: {state: true},
	};

	constructor() {
		super();
		this.name = 'World';
		this._count = 0;
	}

	render() {
		return html`<p>Hello, ${this.name}! Count: ${this._count}</p>`;
	}
}
customElements.define('my-greeting', MyGreeting);
