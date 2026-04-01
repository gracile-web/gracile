import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * Wraps route content and renders `<styled-button>` elements in its shadow
 * DOM. Imported from `document.ts`, so it's defined during `routeImport()`
 * (NOT from `document.client.ts`). This recreates the timing where child CEs
 * (`styled-button`) are already upgraded before the parent's hydration.
 */
@customElement('app-wrapper')
export class AppWrapper extends LitElement {
	render() {
		return html`
			<header class="header">
				<styled-button .label=${'Nav A'}></styled-button>
				<styled-button .label=${'Nav B'}></styled-button>
			</header>
			<div class="body">
				<slot></slot>
			</div>
		`;
	}

	static styles = css`
		:host {
			display: block;
		}
		.header {
			display: flex;
			gap: 8px;
			padding: 8px;
			background: #eee;
		}
		.body {
			padding: 8px;
		}
	`;
}
