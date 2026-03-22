import commonStylesText from '../../common.scss?inline';
import stylesText from './counters.scss?inline';

const commonStyles = await new CSSStyleSheet().replace(commonStylesText);
const styles = await new CSSStyleSheet().replace(stylesText);

export class MyVanillaCounter extends HTMLElement {
	count = 0;

	connectedCallback() {
		const shadow = this.attachShadow({ mode: 'open' });

		shadow.adoptedStyleSheets = [commonStyles, styles];

		this.count = this.getAttribute('count')
			? Number(this.getAttribute('count'))
			: 0;

		shadow.innerHTML = `
			<h1>Wow</h1>

			<button>+1</button>

			<data>${this.count}</data>

			<hr />

			<p><slot> Default slot content fallback </slot></p>
		`;

		shadow.querySelector('button')!.addEventListener('click', () => {
			this.count += 1;
			shadow.querySelector('data')!.innerText = this.count.toString();
			shadow.querySelector('h1')!.className = `emote-${this.count}`;
			console.log(this.count);
		});
	}
}

customElements.define('my-vanilla-counter', MyVanillaCounter);

// Not necessary when using the VSCode TS-Lit-Plugin
declare global {
	interface HTMLCounterTagNameMap {
		'my-vanilla-counter': MyVanillaCounter;
	}
}
