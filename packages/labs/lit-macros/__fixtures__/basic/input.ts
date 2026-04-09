import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('my-greeting')
class MyGreeting extends LitElement {
	@property({type: String})
	name = 'World';

	@state()
	_count = 0;

	render() {
		return html`<p>Hello, ${this.name}! Count: ${this._count}</p>`;
	}
}
