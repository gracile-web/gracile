import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class MyElement extends LitElement {
	constructor() {
		super();
		updateWhenLocaleChanges(this);
	}

	render() {
		return html`<b>${msg('Hello World')}</b>`;
	}
}
customElements.define('my-element', MyElement);
