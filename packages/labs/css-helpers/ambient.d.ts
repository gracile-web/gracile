import type { AdoptGlobalStyles } from './dist/global/provider.js';
import type { AdoptSharedStyle } from './dist/shared/shared-style-provider.js';

declare global {
	interface HTMLElementTagNameMap {
		'adopt-global-styles': AdoptGlobalStyles;
		'adopt-shared-style': AdoptSharedStyle;
	}
}

export {};
