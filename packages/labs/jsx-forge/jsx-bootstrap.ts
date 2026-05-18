`
declare module 'jsx-forge/jsx-runtime' {
	namespace JSX {
		interface IntrinsicElements
			extends JSX.MappedCustomElements<
				CustomElementsAll,
				JSX.BaseHTMLElement
			> {}
	}
}
`;
