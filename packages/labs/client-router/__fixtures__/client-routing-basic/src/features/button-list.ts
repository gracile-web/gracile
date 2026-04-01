import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import './styled-button.js';

/**
 * A parent component that programmatically creates a list of `<styled-button>`
 * child custom elements. Used to reproduce the style-loss bug when new CEs
 * are created during hydration on fresh page load.
 */
@customElement('button-list')
export class ButtonList extends LitElement {
	@property({ type: Array }) items = ['Alpha', 'Beta', 'Gamma'];

	render() {
		return html`
			<div class="list">
				${repeat(
					this.items,
					(item) => item,
					(item) => html`<styled-button .label=${item}></styled-button>`,
				)}
			</div>
		`;
	}

	static styles = css`
		:host {
			display: block;
		}
		.list {
			display: flex;
			gap: 8px;
			color: navy;
		}
	`;
}
