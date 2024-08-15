/// <reference types="vite/client" />

import type { AdoptGlobalStyles } from './dist/assets.js';
import type { RouteTemplateOutlet } from './dist/document.js';

declare global {
	interface HTMLElementTagNameMap {
		'route-template-outlet': RouteTemplateOutlet;
		'adopt-global-styles': AdoptGlobalStyles;
	}
}

export {};
