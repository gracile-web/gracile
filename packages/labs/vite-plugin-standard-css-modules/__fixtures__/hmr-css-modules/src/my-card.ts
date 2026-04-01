import { LitElement, html } from 'lit';
import styles from './my-card.css' with { type: 'css' };

export class MyCard extends LitElement {
	static styles = [styles];

	static properties = {
		count: { type: Number, state: true },
	};

	constructor() {
		super();
		this.count = 0;
	}

	render() {
		return html`
			<div class="title">Card Title</div>
			<div class="body">Card Body</div>
			<button @click=${() => this.count++}>Count: ${this.count}</button>
		`;
	}
}

customElements.define('my-card', MyCard);
