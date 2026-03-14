import { LitElement, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('copy-button')
export class CopyButton extends LitElement {
	static override styles = [
		css`
			i-c {
				fill: currentColor;
				transition: var(--sl-transition-x-fast);

				&:hover {
					transform: scale(1.1);
				}
				&:active {
					transform: scale(0.95);
				}
			}

			.wrapper {
				display: flex;
				align-items: center;
				width: 1em;
				height: 1em;
			}

			:host {
				display: flex;
				cursor: pointer;
			}

			sl-tooltip {
				display: contents;
			}
		`,
	];

	label = 'Copy';
	labelClicked = 'Copied to clipboard!';

	override connectedCallback(): void {
		super.connectedCallback();
		this.addEventListener('click', async () => {
			const textToCopy = this.text || this.parentElement!.innerText;
			if (!textToCopy) throw new Error('No text to copy');

			await navigator.clipboard.writeText(textToCopy);

			this.currentLabel = this.labelClicked;
		});
		this.addEventListener('mouseleave', async () => {
			setTimeout(() => {
				this.currentLabel = this.label;
			}, 100);
		});
	}

	@state() currentLabel = 'Copy';

	@property() text?: string;

	override render() {
		return (
			<sl-tooltip content={this.currentLabel}>
				<div class="wrapper">
					<i-c o="ph:copy-simple-duotone" s="1.3em"></i-c>
				</div>
			</sl-tooltip>
		);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'copy-button': CopyButton & { o: string; s?: string };
	}
}
