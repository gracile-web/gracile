import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lit-element')
export class MyLitElement extends LitElement {
	@property({ type: Number }) count = 0;

	static styles = [
		css`
			:host {
				display: block;
			}
		`,
	];

	render() {
		return html`
			<button
				@click=${() => {
					this.count += 1;
				}}
			>
				Increment
			</button>

			<hr />
			<data>${this.count}</data>
		`;
	}
}
