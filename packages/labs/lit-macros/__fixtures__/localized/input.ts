import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, localized } from '@lit/localize';

@localized()
@customElement('my-element')
class MyElement extends LitElement {
	render() {
		return html`<b>${msg('Hello World')}</b>`;
	}
}
