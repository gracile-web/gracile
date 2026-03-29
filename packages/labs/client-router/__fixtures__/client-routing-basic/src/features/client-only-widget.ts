import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('client-only-widget')
export class ClientOnlyWidget extends LitElement {
	render() {
		return html`<span class="badge">Client CE</span>`;
	}

	static styles = css`
		:host {
			display: inline-block;
		}
		.badge {
			color: purple;
			font-weight: bold;
		}
	`;
}
