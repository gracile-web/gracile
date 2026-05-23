import { LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// FIXME: ESLint doesn't resolve the virtual module in ambient
// eslint-disable-next-line import-x/no-unresolved
import { iconSet } from 'iconify:loader';

// import { unsafeHTML } from 'lit/directives/unsafe-html.js';

// import {getIcons} from '@iconify/utils';

// import { icons } from '@iconify/json/json/ph.json';
// getIcons(icons, [
//   'alarm',
//   'arrow-down',
//   'home',
//   'home-outline',
// ])

@customElement('i-c')
export class IconifyIcon extends LitElement {
	static override styles = [
		css`
			:host {
				display: inline-block;
			}
			svg {
				vertical-align: text-bottom;

				/* border: 1px solid red; */
			}
		`,
	];

	/**
	 * Name
	 */
	@property({ attribute: 'o' }) name?: string;

	/**
	 * Size
	 */
	@property({ attribute: 's' }) size = '1.125em';

	override render() {
		const icon = iconSet.icons?.[this.name?.replace?.('ph:', '') ?? '']?.body;

		if (!icon) throw new Error('Missing ' + this.name);

		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 256 256"
				style={`height: ${this.size}; width: ${this.size}`}
				unsafe:svg={icon}
			/>
		);
	}
}
