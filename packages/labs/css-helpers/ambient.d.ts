import type { AdoptGlobalStyles } from './dist/global-css-provider.js';

declare global {
	interface HTMLElementTagNameMap {
		'adopt-global-styles': AdoptGlobalStyles;
	}
}

export {};
