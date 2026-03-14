import { LitElement, html, css, unsafeCSS, type PropertyValueMap } from 'lit';
import {
	customElement,
	query,
	queryAssignedElements,
	state,
} from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

await import(
	/* @vite-ignore */
	new URL('../../pagefind/pagefind-ui.js', import.meta.url).href
);

// FIXME: focus trap for searchbox (pagefind svelte's component issue ?)

import links from '../styles/typography/links.scss?inline';
import { router } from '../lib/router.js';

import styles from './search-popup.scss?inline';

@customElement('search-popup')
export class SearchPopup extends LitElement {
	static override styles = [
		unsafeCSS(styles),
		unsafeCSS(links),
		/* styles */
	];

	@queryAssignedElements({ selector: 'button' }) button!: HTMLElement[];

	private searchRef = createRef<HTMLDivElement>();

	@state() isSearchBoxVisible = false;

	protected override async firstUpdated() {
		this.button[0]?.addEventListener('click', () => {
			this.isSearchBoxVisible = !this.isSearchBoxVisible;

			this.focusSearchInput();
		});

		router.addEventListener('route-changed', () => {
			this.isSearchBoxVisible = false;
		});

		// @ts-expect-error doesn't exposes typings for now, see https://github.com/CloudCannon/pagefind/issues/334
		// if (import.meta.env.PROD) await import('/pagefind/pagefind-ui.js?url');
		// @ts-expect-error ...
		new PagefindUI({
			element: this.searchRef.value!,
			showSubResults: true,
			translations: {
				placeholder: 'Start typing…',
			},
		});

		//
	}

	#aborter = new AbortController();

	override connectedCallback(): void {
		super.connectedCallback();
		document.addEventListener(
			'keydown',
			(event) => {
				if (event.metaKey && event.key === 'k') this.isSearchBoxVisible = true;
				this.focusSearchInput();
			},
			{ signal: this.#aborter.signal },
		);
	}

	override disconnectedCallback(): void {
		this.#aborter.abort();
		super.disconnectedCallback();
	}

	focusSearchInput() {
		setTimeout(() => {
			this.shadowRoot
				?.querySelector<HTMLInputElement>('.pagefind-ui__search-input')
				?.focus();
		}, 50);
	}

	protected override willUpdate() {
		this.setAttribute('open', String(this.isSearchBoxVisible));
	}

	override render() {
		return (
			<>
				<slot></slot>

				<sl-dialog
					label="Gracile site-wide search"
					prop:open={this.isSearchBoxVisible}
					on:sl-after-hide={() => (this.isSearchBoxVisible = false)}
				>
					<div use:ref={this.searchRef} />
				</sl-dialog>
			</>
		);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'search-popup': SearchPopup;
	}
}
