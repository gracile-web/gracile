// Polyfill Declarative Shadow DOM if it's not supported in the browser (currently non-Chromium).

// Polyfill 1
export function supportsDeclarativeShadowDOM() {
	// eslint-disable-next-line no-prototype-builtins
	return HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot');
}

if (!supportsDeclarativeShadowDOM()) {
	(function attachShadowRoots(root: Document | ShadowRoot) {
		root.querySelectorAll('template[shadowroot]').forEach((el) => {
			const template = el as HTMLTemplateElement;
			const mode = (template.getAttribute('shadowroot') ||
				'open') as ShadowRootMode;
			const shadowRoot = (template.parentNode as HTMLElement).attachShadow({
				mode,
			});
			shadowRoot.appendChild(template.content);
			template.remove();
			attachShadowRoots(shadowRoot);
		});
	})(document);
}

// Polyfill 2
// From: https://github.com/withastro/astro/blob/main/packages/integrations/lit/client-shim.js

// async function polyfill() {
//   const { hydrateShadowRoots } = await import(
//     "@webcomponents/template-shadowroot/template-shadowroot.js"
//   );
//   window.addEventListener(
//     "DOMContentLoaded",
//     () => hydrateShadowRoots(document.body),
//     {
//       once: true,
//     }
//   );
// }

// const polyfillCheckEl = new DOMParser()
//   .parseFromString(
//     `<p><template shadowroot="open" shadowrootmode="open"></template></p>`,
//     "text/html",
//     { includeShadowRoots: true }
//   )
//   .querySelector("p");

// if (!polyfillCheckEl?.shadowRoot) {
//   polyfill();
// }
