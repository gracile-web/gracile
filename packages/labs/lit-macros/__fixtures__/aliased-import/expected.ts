import { LitElement, html } from 'lit';

class AliasedEl extends LitElement {
	static properties = {
		name: {type: String},
		_open: {state: true},
	};

	constructor() {
		super();
		this.name = '';
		this._open = false;
	}

	render() {
		return html`<p>${this.name} ${this._open}</p>`;
	}
}
customElements.define('aliased-el', AliasedEl);
