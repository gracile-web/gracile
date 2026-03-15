import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-widget')
export class MyWidget extends LitElement {
	override render() {
		return html`<p>widget-ssr-content</p>`;
	}
}
