import { css, html, LitElement } from 'lit';

export class MyCounter extends LitElement {
	static properties = {
		greeting: { type: String },
		count: { type: Number, state: true },
	};

	constructor() {
		super();
		this.greeting = 'Hello';
		this.count = 0;
	}

	render() {
		return html`
			<div class="greeting">${this.greeting} World</div>
			<button @click=${() => this.count++}>Count: ${this.count}</button>
		`;
	}

	static styles = css`
		:host {
			display: block;
			padding: 1rem;
			background: aliceblue;
		}
		.greeting {
			color: darkblue;
		}
	`;
}

customElements.define('my-counter', MyCounter);
