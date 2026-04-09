import { LitElement, html } from 'lit';
import { queryAssignedElements, queryAssignedNodes } from 'lit/decorators.js';

class SlotHost extends LitElement {
	@queryAssignedElements({slot: 'content'})
	_contentEls: HTMLElement[] | undefined;

	@queryAssignedElements({slot: 'items', selector: '.active', flatten: true})
	_activeItems: HTMLElement[] | undefined;

	@queryAssignedElements()
	_defaultSlotEls: HTMLElement[] | undefined;

	@queryAssignedNodes({slot: 'text', flatten: true})
	_textNodes: Node[] | undefined;

	@queryAssignedNodes()
	_defaultNodes: Node[] | undefined;

	render() {
		return html`
			<slot name="content"></slot>
			<slot name="items"></slot>
			<slot name="text"></slot>
			<slot></slot>
		`;
	}
}
