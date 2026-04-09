import { LitElement, html } from 'lit';

class MyWidget extends LitElement {
	static properties = {
		label: {type: String},
		_clicks: {state: true},
	};

	existingField = 'untouched';

	constructor() {
		super();
		this.label = 'Click me';
		this._clicks = 0;
		this.existingField = 'set in constructor';
		console.log('widget created');
	}

	render() {
		return html`<button>${this.label} (${this._clicks})</button>`;
	}
}
customElements.define('my-widget', MyWidget);
