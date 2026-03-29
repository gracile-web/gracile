import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('server-only-widget')
export class ServerOnlyWidget extends LitElement {
	render() {
		return html`<span class="badge">Server CE</span>`;
	}

	static styles = css`
		:host {
			display: inline-block;
		}
		.badge {
			color: green;
			font-weight: bold;
		}
	`;
}
