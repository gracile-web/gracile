import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('mixed-fields')
class MixedFields extends LitElement {
	@property({type: String})
	accessor name = 'World';

	@property({type: Number, reflect: true})
	count = 0;

	@state()
	accessor _active = false;

	@state()
	_message = 'hello';

	render() {
		return html`<p>${this.name}: ${this._message} (${this.count})</p>`;
	}
}
