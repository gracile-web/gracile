// import '../lib/asciinema-player/asciinema-player.js';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import terminal from '../assets/icons/terminal.svg';

@customElement('asciinema-player-header')
export class AsciinemaPlayerHeader extends LitElement {
	static styles = [
		css`
			:host {
				display: flex;
				gap: 8px;
				padding: 2px 9px;
				align-items: center;
				height: 24px;
				/* padding: 1px; */

				border-bottom: 1px solid var(--sl-color-neutral-200);
			}

			svg {
				height: 1em;
				fill: var(--sl-color-primary-800);
			}

			.pill {
				height: 12px;
				width: 12px;
				border-radius: 99rem;
			}

			.pill-1 {
				background-color: #ed6a5e;
			}
			.pill-2 {
				background-color: #f4be4f;
			}
			.pill-3 {
				background-color: #61c654;
			}

			.title {
				width: 100%;
				display: flex;
				justify-content: center;
				gap: 0.5rem;
				align-items: center;
				padding-right: 48px;
				font-size: var(--sl-font-size-small);
				color: var(--sl-color-neutral-800);
			}
		`,
	];

	render() {
		return html`
			<div class="pill pill-1"></div>
			<div class="pill pill-2"></div>
			<div class="pill pill-3"></div>

			<div class="title">${terminal}<slot></slot></div>
		`;
	}
}
