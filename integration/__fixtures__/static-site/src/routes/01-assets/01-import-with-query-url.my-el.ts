import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import styles from './_00-import-with-query-url.scss?url';

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

	@property({ type: Array, converter: (s) => s?.split(',') })
	'extra-styles': string[] | string | null = null;

	render() {
		if (typeof this['extra-styles'] === 'string') throw new Error();

		return html`
			<!--  -->
			<link rel="stylesheet" href=${styles} />

			${this['extra-styles']?.join(' --- ')}
			${this['extra-styles']?.map(
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
