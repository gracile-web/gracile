/* eslint-disable no-restricted-syntax */
import '../../features/my-greetings-adopted.js';

console.log('Hello from client! (Home)');

// class AdoptedStylesheets extends HTMLElement {
// 	connectedCallback() {
// 		const elementSpecifiers = this.getAttribute('specifiers')
// 			?.split(',')
// 			.map((specifier) => specifier.trim());

// 		if (!elementSpecifiers)
// 			throw new ReferenceError(
// 				`The \`specifiers\` attribute for the \`<adopted-stylesheets>\` element is mandatory.`,
// 			);

// 		const cssModules = document.head.querySelectorAll('[type="css-module"]');

// 		for (const cssModule of cssModules) {
// 			const styleSheetSpecifier = cssModule.getAttribute('specifier');
// 			if (!styleSheetSpecifier)
// 				throw new ReferenceError(`The \`specifier\` attribute is mandatory.`);

// 			if (
// 				elementSpecifiers.find(
// 					(elementSpecifier) => elementSpecifier === styleSheetSpecifier,
// 				)
// 			) {
// 				const element = this.getRootNode();
// 				if (element instanceof ShadowRoot === false)
// 					throw new Error('No shadow root found.');

// 				const stylesheet = new CSSStyleSheet();
// 				stylesheet.replaceSync(cssModule.innerHTML);

// 				element.adoptedStyleSheets.push(stylesheet);
// 			}
// 		}
// 	}
// }
// customElements.define('adopted-stylesheets', AdoptedStylesheets);
