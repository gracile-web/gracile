import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('styled-button')
export class StyledButton extends LitElement {
	@property() label = '';

	render() {
		return html`<button class="btn">${this.label}</button>`;
	}

	static styles = css`
		:host {
			display: inline-block;
		}
		.btn {
			color: crimson;
			font-weight: bold;
			border: 2px solid crimson;
			padding: 4px 8px;
		}
	`;
}
