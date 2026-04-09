import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

class MyWidget extends LitElement {
	@property({type: String, reflect: true})
	label = '';

	@property({type: Number, attribute: 'max-count'})
	maxCount = 100;

	@property({type: Boolean})
	disabled = false;

	@property()
	data: unknown;

	render() {
		return html`<div>${this.label}</div>`;
	}
}
