import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('status-card')
export class StatusCard extends LitElement {
	@property() label = '';
	@property() value = '';

	render() {
		return html`
			<div class="card">
				<dt class="label">${this.label}</dt>
				<dd class="value">
					<code>${this.value}</code>
				</dd>
			</div>
		`;
	}

	static styles = css`
		:host {
			display: block;
		}

		.card {
			border: 1px solid light-dark(gainsboro, dimgray);
			border-radius: 8px;
			padding: 1rem;
			margin-bottom: 0.75rem;
		}

		.label {
			font-weight: 600;
			margin-bottom: 0.25rem;
			font-size: 0.875rem;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			opacity: 0.7;
		}

		.value {
			margin: 0;
			font-size: 1.125rem;
		}

		code {
			font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
			word-break: break-all;
		}
	`;
}
