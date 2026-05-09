import { LitElement, html } from 'lit';
import { eventOptions } from 'lit/decorators.js';

class PartialImport extends LitElement {
	static properties = {
		name: {type: String},
	};

	constructor() {
		super();
		this.name = '';
	}

	@eventOptions({passive: true})
	_handleScroll() {}

	render() {
		return html`<div id="main">${this.name}</div>`;
	}
}
customElements.define('partial-import', PartialImport);
