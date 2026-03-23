import { ElementRenderer } from '@lit-labs/ssr/lib/element-renderer.js';

import { TAG_NAME, type Data, type IslandRegistry } from './types.js';

export function makeIslandRenderer(
	registry: IslandRegistry,
): typeof ElementRenderer {
	const renderer = class GenericIslandRenderer extends ElementRenderer {
		static override matchesClass(
			_ceClass: typeof HTMLElement,
			tagName: string,
		): boolean {
			return tagName === TAG_NAME;
		}

		public light = false;
		public load?: string;
		public props?: Data;

		override setAttribute(name: string, value: string): void {
			if (name === 'props') {
				try {
					this.props = JSON.parse(value);
				} catch (error) {
					console.error(`Invalid JSON in props for island`, error);
				}
			}

			if (name === 'light') this.light = true;
			if (name === 'load') this.load = value;
		}

		override renderAttributes(): string[] {
			const raw = JSON.stringify(this.props ?? {});
			return [
				this.light ? ' light' : '',
				this.load ? ` load=${this.load}` : '',
				this.props ? ` props='${raw.replaceAll("'", '&#39;')}'` : '',
			];
		}

		// @ts-expect-error - return type is actually `Iterable<string> | void`
		renderShadow(): Iterable<string> | undefined {
			if (this.light) return;
			return this.#render();
		}

		// @ts-expect-error - return type is actually `Iterable<string> | void`
		renderLight(): Iterable<string> | undefined {
			if (this.light) return this.#render();
		}

		#render(): Iterable<string> {
			const load = this.load;
			if (!load) throw new ReferenceError('Missing "load" attribute.');

			const island = registry.islands?.[load];

			if (!island) return [`<!-- unknown island: ${load} -->`];

			const html = island(this.props);
			return [html];
		}
	};

	return renderer as typeof ElementRenderer;
}

// NOTE: On server, Lit SSR doesn't seems to care at all about CE ctors.
customElements.define(TAG_NAME, new Object() as typeof HTMLElement);
