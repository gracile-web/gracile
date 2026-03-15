import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type MyComponentUpdateEvent = {
	message: string;
};

//

export type MyComponentInputEvent = 'value1' | 'value2' | 'value3';

/**
 * Hello
 *
 * @event {MyComponentUpdateEvent} update - emitted when updated
 * @event {MyComponentInputEvent} input - emitted when inputaaaaa
 * @slot Test - the slot to use
 */
@customElement('title-element')
export class TitleElement extends LitElement {
	static styles = [
		css`
			:host {
				display: block;
			}
		`,
	];

	/**
	 * Some stuff
	 */
	@property({ type: Object, attribute: true, reflect: true })
	someObject: {
		some: 'foo';
	} = {
		some: 'foo',
	};

	/**
	 * Some stuff Prop 2
	 */
	@property({ attribute: 'someprop' }) someProp: string = 'hello';

	@property({ type: Boolean, attribute: true }) hey: boolean = false;

	render() {
		return html`
			<div>
				<!--  -->
				Hello
			</div>
		`;
	}
}
