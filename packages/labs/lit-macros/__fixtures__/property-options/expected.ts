import { LitElement, html } from 'lit';

class MyWidget extends LitElement {
	static properties = {
		label: {type: String, reflect: true},
		maxCount: {type: Number, attribute: 'max-count'},
		disabled: {type: Boolean},
		data: {},
	};

	constructor() {
		super();
		this.label = '';
		this.maxCount = 100;
		this.disabled = false;
	}

	render() {
		return html`<div>${this.label}</div>`;
	}
}
