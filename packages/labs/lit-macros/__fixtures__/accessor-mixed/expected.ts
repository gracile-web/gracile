import { LitElement, html } from 'lit';

class MixedFields extends LitElement {
	static properties = {
		name: {type: String},
		count: {type: Number, reflect: true},
		_active: {state: true},
		_message: {state: true},
	};

	constructor() {
		super();
		this.name = 'World';
		this.count = 0;
		this._active = false;
		this._message = 'hello';
	}

	render() {
		return html`<p>${this.name}: ${this._message} (${this.count})</p>`;
	}
}
customElements.define('mixed-fields', MixedFields);
