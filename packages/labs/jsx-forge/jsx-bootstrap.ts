`
type _CssCustomProperties = Record<keyof GlobalCss['properties'], string>;

declare module 'jsx-forge/jsx-runtime' {
	namespace JSX {
		interface IntrinsicElements
			extends JSX.MappedCustomElements<
				CustomElementsAll,
				JSX.BaseHTMLElement
			> {}

		interface CssCustomProperties extends _CssCustomProperties {}
	}
}
`;
