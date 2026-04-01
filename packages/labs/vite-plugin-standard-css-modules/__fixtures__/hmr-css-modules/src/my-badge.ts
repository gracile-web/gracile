import { LitElement, html } from 'lit';
import styles from './my-badge.css' with { type: 'css-lit' };

export class MyBadge extends LitElement {
	static styles = [styles];

	render() {
		return html`<span class="label">Badge</span>`;
	}
}

customElements.define('my-badge', MyBadge);
