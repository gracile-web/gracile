import '@gracile-labs/babel-plugin-jsx-to-literals/jsx-runtime';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	export namespace JSX {
		interface IntrinsicElements {
			/**
			 * Gracile router template outlet (used in server rendered document).
			 */
			'route-template-outlet': Record<string, never>;
		}
	}
}
