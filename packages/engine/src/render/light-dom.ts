import { LitElementRenderer } from '@lit-labs/ssr/lib/lit-element-renderer.js';
import type { ThunkedRenderResult } from '@lit-labs/ssr/lib/render-result.js';

export class LightDomLitElementRenderer extends LitElementRenderer {
	static override matchesClass(ctor: typeof HTMLElement) {
		// return (ctor as any)._$lightDom === true;
		return true;
	}

	// eslint-disable-next-line class-methods-use-this
	override renderShadow(): ThunkedRenderResult {
		return;
		// return []; // ← no <template shadowrootmode> emitted
		// return [];
	}

	override renderLight(renderInfo) {
		// Emit the render() output as direct light-DOM children
		// yield* super.renderShadow(renderInfo);

		// return super.renderLight(renderInfo);
		const result = this.element.render();

		console.log({ result });
		// return renderInfo.render(result);
		return ['<div>Light DOM content</div>'];
		//   yield* renderInfo.render(result);
	}

	// 	override *renderLight(renderInfo) {
	//   const result = this.element.render();
	//   yield* renderInfo.render(result);
	// }
}

// NOTE: On server, Lit SSR doesn't seems to care at all about CE ctors.
// customElements.define('app-shell', new Object() as typeof HTMLElement);
