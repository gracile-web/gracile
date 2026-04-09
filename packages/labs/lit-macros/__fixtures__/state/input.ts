import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('my-counter')
class MyCounter extends LitElement {
	@state()
	_value = 0;

	@state({hasChanged: (n: number, o: number) => Math.abs(n - o) > 1})
	_threshold = 10;

	render() {
		return html`<span>${this._value}</span>`;
	}
}
