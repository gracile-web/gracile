import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import stylesInline from './_02-import-with-query-inline.scss?inline';

@customElement('my-el-with-inline-css')
export class MyEl extends LitElement {
	static styles = [
		css`
			:host {
				display: block;
			}
		`,
		unsafeCSS(stylesInline),
	];

	render() {
		return html`
			<div class="color-me-red">RED</div>
			<div class="color-me-green">GREEN</div>
		`;
	}
}
