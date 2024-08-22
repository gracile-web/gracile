/// <reference types="vite/client" />

import type { RouteTemplateOutlet } from './dist/document.js';

declare global {
	interface HTMLElementTagNameMap {
		'route-template-outlet': RouteTemplateOutlet;
	}
}

export {};
