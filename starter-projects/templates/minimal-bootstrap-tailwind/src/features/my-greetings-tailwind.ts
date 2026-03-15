import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// import tailwindStyles from '../tailwind.css?url';

/**
 * Sssss
 */
@customElement('my-greetings-tailwind')
export class MyGreetingsTailwind extends LitElement {
	@property() name = 'World';

	firstUpdated(): void {
		setInterval(() => {
			this.name = this.name === 'Gracile' ? 'World' : 'Gracile';
		}, 2500);
	}

	render() {
		return html`
			<adopt-global-styles></adopt-global-styles>

			<div class="text-3xl font-bold underline">Hello ${this.name}!</div>
		`;
	}

	static styles = [
		css`
			:host {
				display: block;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'my-greetings-tailwind': MyGreetingsTailwind;
	}
}
