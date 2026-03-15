import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import commonStyles from '../../common.scss?inline';
import styles from './counters.scss?inline';

@customElement('my-lit-counter')
export class MyLitCounter extends LitElement {
	@property({ type: Number }) count = 0;

	override render() {
		return html`
			<h1 class=${`emote-${this.count}`}>Wow</h1>
			<button
				@click=${() => {
					this.count += 1;
					console.log(this.count);
				}}
			>
				+1
			</button>

			<data>${this.count}</data>

			<hr />

			<p>
				<slot> Default slot content fallback </slot>
			</p>
		`;
	}

	static override styles = [unsafeCSS(commonStyles), unsafeCSS(styles)];
}

// Not necessary when using the VSCode TS-Lit-Plugin
declare global {
	interface HTMLCounterTagNameMap {
		'my-lit-counter': MyLitCounter;
	}
}
