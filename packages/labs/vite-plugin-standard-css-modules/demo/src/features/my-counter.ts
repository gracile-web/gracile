import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Using `type: 'css'` — returns CSSStyleSheet on client, CSSResult during SSR
import counterStyles from './my-counter.css' with { type: 'css' };

// Forces CSSResult output even in client mode
import counterStylesLit from './my-counter.css' with { type: 'css-lit' };

@customElement('my-counter')
export class MyCounter extends LitElement {
	@property({ type: Number }) count = 0;

	render() {
		return html`
			<slot></slot>
			<div class="card">
				<button @click=${this.#onClick}>count is ${this.count}</button>
			</div>

			<section>
				<code>CSSStylesheet</code>
				<hr />
				(<code>counterStyles.cssRules.item(0)</code>):
				<pre><code>${counterStyles.cssRules.item(0)?.cssText}</code></pre>
			</section>
			<section>
				<code>CSSResult</code>:
				<hr />
				<pre><code>${counterStylesLit.toString()}</code></pre>
			</section>
		`;
	}

	#onClick() {
		this.count++;
	}

	static styles = [counterStyles];
}
