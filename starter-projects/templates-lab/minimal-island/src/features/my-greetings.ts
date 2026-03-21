import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-greetings')
export class MyGreetings extends LitElement {
	@property() name = 'world';

	firstUpdated(): void {
		setTimeout(() => {
			this.name = 'Gracile';
		}, 1500);
	}

	render() {
		return html` <div>Hello ${this.name}!</div> `;
	}

	static styles = [
		css`
			:host {
				display: block;
			}
		`,
	];
}
