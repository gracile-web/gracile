import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import cardStyles from './my-card.css?inline';

@customElement('my-card')
export class MyCard extends LitElement {
	@property() heading = '';

	render() {
		return html`
			<div class="card">
				<h2>${this.heading}</h2>
				<slot></slot>
			</div>
		`;
	}

	static styles = [unsafeCSS(cardStyles)];
}
