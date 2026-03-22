/* eslint-disable max-lines */
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-greetings')
export class MyGreetings extends LitElement {
	static styles = [
		css`
			:host {
				display: block;
			}
		`,
	];

	@property() name = 'World';

	firstUpdated(): void {
		setInterval(() => {
			this.name = this.name === 'Gracile' ? 'World' : 'Gracile';
		}, 1500);
	}

	render() {
		return html` <div>Hello ${this.name}!</div> `;
	}
}
