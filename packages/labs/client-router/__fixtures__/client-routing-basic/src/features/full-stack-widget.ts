import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('full-stack-widget')
export class FullStackWidget extends LitElement {
	render() {
		return html`<span class="badge">Full-Stack CE</span>`;
	}

	static styles = css`
		:host {
			display: inline-block;
		}
		.badge {
			color: teal;
			font-weight: bold;
		}
	`;
}
