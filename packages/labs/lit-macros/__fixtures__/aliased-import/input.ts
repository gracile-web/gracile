import { LitElement, html } from 'lit';
import { customElement, property as prop, state } from 'lit/decorators.js';

@customElement('aliased-el')
class AliasedEl extends LitElement {
	@prop({type: String})
	name = '';

	@state()
	_open = false;

	render() {
		return html`<p>${this.name} ${this._open}</p>`;
	}
}
