import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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

	static styles = [
		css`
			:host {
				display: block;
				margin: 1em 0;
			}
			.card {
				padding: 1em;
				border: 2px solid steelblue;
				border-radius: 8px;
				background: aliceblue;
			}
			h2 {
				margin: 0 0 0.5em;
				color: steelblue;
			}
		`,
	];
}
