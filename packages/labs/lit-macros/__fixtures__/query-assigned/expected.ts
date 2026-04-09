import { LitElement, html } from 'lit';

class SlotHost extends LitElement {
	get _contentEls() {
		const slot = this.renderRoot?.querySelector('slot[name="content"]');
		const els = slot?.assignedElements() ?? [];
		return els;
	}

	get _activeItems() {
		const slot = this.renderRoot?.querySelector('slot[name="items"]');
		const els = slot?.assignedElements({flatten: true}) ?? [];
		return els.filter(e => e.matches('.active'));
	}

	get _defaultSlotEls() {
		const slot = this.renderRoot?.querySelector('slot:not([name])');
		const els = slot?.assignedElements() ?? [];
		return els;
	}

	get _textNodes() {
		const slot = this.renderRoot?.querySelector('slot[name="text"]');
		return slot?.assignedNodes({flatten: true}) ?? [];
	}

	get _defaultNodes() {
		const slot = this.renderRoot?.querySelector('slot:not([name])');
		return slot?.assignedNodes() ?? [];
	}

	render() {
		return html`
			<slot name="content"></slot>
			<slot name="items"></slot>
			<slot name="text"></slot>
			<slot></slot>
		`;
	}
}
