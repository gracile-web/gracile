/// <reference types="@gracile/gracile/ambient" />

import type { CustomElements } from './jsx.js';

declare global {
	export namespace JSX {
		interface IntrinsicElements extends CustomElements {}
	}
}
