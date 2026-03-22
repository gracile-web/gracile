import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import styles from './_assets-methods-my-el.scss?url';

@customElement('my-el')
export class MyEl extends LitElement {
	static styles = [
		css`
			:host {
				display: block;
			}
		`,
	];

	@state() toggled = false;

	@property({ attribute: 'extra-styles', type: Array, converter: (s) => s?.split(',') })
	// NOTE: 'extra-styles' crashes with Vite 8.0.1 (https://github.com/oxc-project/oxc/issues/20418)
	extraStyles: string[] | string | null = null; 

	render() {
		if (typeof this.extraStyles === 'string') throw new Error();

		return html`
			<!--  -->
			<link rel="stylesheet" href=${styles} />

			${this.extraStyles?.join(' --- ')}
			${this.extraStyles?.map(
				(styleSheet) => html`<link rel="stylesheet" href=${styleSheet} />`,
			)}

			<div class="color-me-red">RED</div>
			<div class="color-me-green">GREEN</div>

			${this.toggled
				? html` <!--  -->
						<h2>elephant</h2>
						<div class="color-me-red">RED</div>
						<div class="color-me-green">GREEN</div>

						<button
							@click=${() => {
								this.toggled = false;
								console.log('elephant');
							}}
						>
							CLICK ME
						</button>`
				: html` <!--  -->
						<h2>lion</h2>
						<div class="color-me-red">RED</div>
						<div class="color-me-green">GREEN</div>

						<button
							@click=${() => {
								this.toggled = true;
								console.log('lion');
							}}
						>
							CLICK ME
						</button>`}
		`;
	}
}
