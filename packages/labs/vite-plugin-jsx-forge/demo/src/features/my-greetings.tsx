import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-greetings')
export class MyGreetings extends LitElement {
	@property() name = 'world';

	override firstUpdated(): void {
		setTimeout(() => {
			this.name = 'Gracile';
		}, 1500);
	}

	override render() {
		return (
			<div>
				Hello <strong>{this.name}</strong>!
			</div>
		);
	}

	static override styles = [
		css`
			:host {
				display: block;
			}
		`,
	];
}
