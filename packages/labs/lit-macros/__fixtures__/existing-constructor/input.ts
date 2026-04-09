import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('my-widget')
class MyWidget extends LitElement {
	@property({type: String})
	label = 'Click me';

	@state()
	_clicks = 0;

	existingField = 'untouched';

	constructor() {
		super();
		this.existingField = 'set in constructor';
		console.log('widget created');
	}

	render() {
		return html`<button>${this.label} (${this._clicks})</button>`;
	}
}
