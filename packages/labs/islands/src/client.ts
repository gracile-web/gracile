// @ts-expect-error Resolve by Vite
// eslint-disable-next-line import-x/no-unresolved
import islandRegistry from '/islands.config';
import type { IslandRegistry } from './types.js';

const registry = islandRegistry as IslandRegistry['islands'];

class IslandElement extends HTMLElement {
	static {
		customElements.define('is-land', this);
	}

	connectedCallback() {
		const light = this.hasAttribute('light');
		const load = this.getAttribute('load');
		if (!load) throw new ReferenceError('"load" attribute missing');

		const island = registry[load as keyof typeof registry];
		if (!island) throw new ReferenceError('Hydrate function missing');

		try {
			const properties = this.dataset['props']
				? JSON.parse(this.dataset['props'])
				: {};

			const host = light ? this : this.shadowRoot!;

			island(properties, host);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(`Failed to hydrate island`, error);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'is-island': IslandElement;
	}
}
