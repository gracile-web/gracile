import { LitElement, html } from 'lit';

class MyPanel extends LitElement {
	get _header() { return this.renderRoot?.querySelector('#header') ?? null; }

	get _items() { return this.renderRoot?.querySelectorAll('.item') ?? []; }

	get _lazy() {
		return this.updateComplete.then(
			() => this.renderRoot.querySelector('#lazy'),
		);
	}

	render() {
		return html`
			<div id="header">Title</div>
			<div class="item">A</div>
			<div class="item">B</div>
			<div id="lazy">Loaded</div>
		`;
	}
}
