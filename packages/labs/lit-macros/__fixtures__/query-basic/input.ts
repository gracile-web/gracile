import { LitElement, html } from 'lit';
import { query, queryAll, queryAsync } from 'lit/decorators.js';

class MyPanel extends LitElement {
	@query('#header')
	_header: HTMLElement | undefined;

	@queryAll('.item')
	_items: NodeListOf<HTMLElement> | undefined;

	@queryAsync('#lazy')
	_lazy: Promise<HTMLElement | null> | undefined;

	render() {
		return html`
			<div id="header">Title</div>
			<div class="item">A</div>
			<div class="item">B</div>
			<div id="lazy">Loaded</div>
		`;
	}
}
