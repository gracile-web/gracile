import { css, html, isServer, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

if (isServer === false) {
	await import('../../features/counters/my-vanilla-counter.js');
	await import('../../features/counters/my-lit-counter.js');
}

@customElement('markdown-editor')
export class MarkdownEditor extends LitElement {
	@property() initial = '';

	#editorRef = createRef<HTMLPreElement>();

	#resultRef = createRef<HTMLDivElement>();

	async refresh() {
		const result = await fetch('./markdown-api/', {
			body: this.#editorRef.value!.innerText,
			method: 'POST',
		}).then((r) => r.text());

		console.log({ result });

		const element = this.#resultRef.value!;
		// NOTE: Might use `setHTMLUnsafe` or `setHTML` when widespread.
		// @ts-expect-error Types not implemented
		if ('setHTML' in element) element.setHTML(result);
		// @ts-expect-error Types not implemented
		else if ('setHTMLUnsafe' in element) element.setHTMLUnsafe(result);
		else element.innerHTML = result;
	}

	override async firstUpdated() {
		await this.refresh();
	}

	override render() {
		return html`
			<pre
				class="panel"
				${ref(this.#editorRef)}
				contenteditable
				@input=${this.refresh.bind(this)}
			>
${this.initial}</pre
			>

			<div class="panel" ${ref(this.#resultRef)}></div>
		`;
	}

	static override styles = [
		css`
			:host {
				display: flex;
				width: 100%;
				padding: 3rem;
				gap: 3rem;
				min-height: 62vh;
			}

			.panel {
				padding: 1rem;
				flex-basis: 50%;
			}

			pre {
				background-color: var(--color-gray-50);
				overflow-x: scroll;
			}
		`,
	];
}

declare global {
	interface HTMLCounterTagNameMap {
		'markdown-editor': MarkdownEditor;
	}
}
