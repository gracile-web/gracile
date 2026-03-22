import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('my-greetings')
export class MyGreetings extends LitElement {
	@property() name = 'world';

	firstUpdated(): void {
		setTimeout(() => {
			this.name = 'Gracile';
		}, 1500);
	}

	@state() count = 0;

	render() {
		return html`
			<div>Hello ${this.name}!</div>
			<button
				@click=${() => {
					this.count += 1;
				}}
			>
				Count ${this.count}
			</button>
		`;
	}

	static styles = [
		css`
			:host {
				display: block;
				/* color: blue; */
				background-color: black;
				padding: 1rem;
			}
		`,
	];
}
