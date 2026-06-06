import type { CustomElements as CustomElements_local } from './custom-elements';
import type { GlobalCss } from './custom-elements';
import type { CustomElements as CustomElements_awesome_me__webawesome } from './awesome_me__webawesome.custom-elements';
import type { CustomElements as CustomElements_shoelace_style__shoelace } from './shoelace-style__shoelace.custom-elements';
import type { CustomElements as CustomElements_unpic__lit } from './unpic__lit.custom-elements';
import type { CustomElements as CustomElements_gracile__gracile } from './gracile__gracile.custom-elements';
interface CustomElementsAll
	extends
		CustomElements_local,
		CustomElements_awesome_me__webawesome,
		CustomElements_shoelace_style__shoelace,
		CustomElements_unpic__lit,
		CustomElements_gracile__gracile {}

type _CssCustomProperties = Record<keyof GlobalCss['properties'], string>;

declare module 'jsx-forge/jsx-runtime' {
	namespace JSX {
		interface IntrinsicElements extends JSX.MappedCustomElements<
			CustomElementsAll,
			JSX.BaseHTMLElement
		> {}

		interface CssCustomProperties extends _CssCustomProperties {}
	}
}
