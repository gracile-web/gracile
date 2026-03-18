import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-greetings')
export class MyGreetings extends LitElement {
	@property() name = 'World';

	render() {
		return html`<div class="greeting">Hello ${this.name}!</div>`;
	}

	static styles = [
		css`
			:host {
				display: block;
			}
			.greeting {
				color: darkblue;
				font-weight: bold;
			}
		`,
	];
}
