import { LitElement, html } from 'lit';

class PlainElement extends LitElement {
	static properties = {
		name: {type: String},
	};

	name = '';

	render() {
		return html`<p>${this.name}</p>`;
	}
}

customElements.define('plain-element', PlainElement);
