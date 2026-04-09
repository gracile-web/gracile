import { LitElement, html } from 'lit';
import { customElement, property, eventOptions } from 'lit/decorators.js';

@customElement('partial-import')
class PartialImport extends LitElement {
	@property({type: String})
	name = '';

	@eventOptions({passive: true})
	_handleScroll() {}

	render() {
		return html`<div id="main">${this.name}</div>`;
	}
}
