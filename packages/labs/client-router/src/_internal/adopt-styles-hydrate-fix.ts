import {
	adoptStyles,
	type CSSResultOrNative,
} from '@lit/reactive-element/css-tag.js';

// HACK: Workaround for hydration-support's patched `createRenderRoot` not
// calling `adoptStyles` on fresh (non-SSR) elements.
// After `render()`, we wait a macrotask (setTimeout 0) so every LitElement
// update cycle — including deeply nested children — has flushed and created
// its shadow root. Then we walk the full DOM tree, pierce into each shadow
// root, and re-apply `adoptStyles` from `constructor.elementStyles`.
export async function reAdoptAllStylesFix(root: ParentNode): Promise<void> {
	// Wait for all LitElement update cycles to flush (including
	// nested children created during parent renders) before
	// walking the DOM. A macrotask (setTimeout 0) guarantees the
	// microtask queue is fully drained.
	// NOTE: A microtask seems to work, too.
	// But just to be safe, we wait a full tick, to make sure every update

	// await new Promise((r) => setTimeout(r, 0));

	await new Promise<void>((resolve) => {
		queueMicrotask(() => {
			reAdoptAllStyles(root);
			resolve();
		});
	});
}

function reAdoptAllStyles(root: ParentNode): void {
	for (const el of root.querySelectorAll('*')) {
		const shadow = el.shadowRoot;
		if (!shadow) continue;
		const ctor = el.constructor as { elementStyles?: CSSResultOrNative[] };
		const styles = ctor.elementStyles;
		// Only call adoptStyles when sheets are missing.
		if (styles?.length && shadow.adoptedStyleSheets.length !== styles.length) {
			adoptStyles(shadow, styles);
		}
		// Always recurse — nested shadows may need fixing even if parent is ok.
		reAdoptAllStyles(shadow);
	}
}
