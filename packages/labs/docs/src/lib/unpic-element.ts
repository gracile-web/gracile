// NOTE: Manually implements unpic instead of using @unpic/lit because the
// official Lit adapter doesn't integrate with our custom element setup.
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
	type CoreImageAttributes,
	type BaseImageProps,
	type Layout,
	type UnpicImageProps,
	transformProps,
} from '@unpic/core';
import { type ImageCdn } from 'unpic';

@customElement('unpic-img')
export class UnpicImg
	extends LitElement
	implements BaseImageProps<Partial<HTMLImageElement>, CSSStyleDeclaration>
{
	@property({ type: String }) src = '';
	@property({ type: String }) alt = '';
	@property({ type: Number }) height?: number;

	@property({ type: Number }) width?: number;
	@property({ type: Boolean }) priority?: boolean;
	@property({ type: String }) fetchpriority?: 'high' | 'low';
	@property({ type: String }) loading?: 'eager' | 'lazy';
	@property({ type: String }) decoding?: 'sync' | 'async' | 'auto';

	@property({ type: String }) background?: string;
	@property({ type: String }) objectFit?:
		| 'contain'
		| 'cover'
		| 'fill'
		| 'none'
		| 'scale-down'
		| 'inherit'
		| 'initial';
	@property({ type: Number }) aspectRatio?: number;
	@property({ type: String }) layout?: Layout;
	@property({ type: Array }) breakpoints?: number[];
	@property({ type: String }) cdn?: ImageCdn;

	override render() {
		const inputProperties = {
			src: this.src,
			width: this.width,
			height: this.height,
			alt: this.alt,
			loading: this.loading,
			decoding: this.decoding,
			role: this.role,
			sizes: this.sizes,
			fetchpriority: this.fetchpriority,
			background: this.background,
			objectFit: this.objectFit,
			aspectRatio: this.aspectRatio,
			layout: this.layout as Layout,
			breakpoints: this.breakpoints,
			cdn: this.cdn,
		} as UnpicImageProps<CoreImageAttributes<StyleInfo>>;

		const transformedProperties = transformProps<
			CoreImageAttributes<StyleInfo>,
			StyleInfo
		>(inputProperties);

		return html`
			<img
				part="image"
				src=${transformedProperties.src}
				alt=${transformedProperties.alt}
				width=${transformedProperties.width}
				height=${transformedProperties.height}
				style=${styleMap(transformedProperties.style ?? {})}
				srcset=${transformedProperties.srcset}
				role=${ifDefined(transformedProperties.role)}
				sizes=${transformedProperties.sizes}
				loading=${transformedProperties.loading}
				fetchpriority=${ifDefined(transformedProperties.fetchpriority)}
				decoding=${ifDefined(transformedProperties.decoding)}
				crossorigin=${ifDefined(this.crossOrigin)}
				ismap=${ifDefined(this.isMap)}
				name=${ifDefined(this.name)}
				referrerpolicy=${ifDefined(this.referrerPolicy)}
				usemap=${ifDefined(this.useMap)}
				@error=${(event: Event) =>
					this.dispatchEvent(new ErrorEvent(event.type, event))}
				@load=${(event: Event) =>
					this.dispatchEvent(new Event(event.type, event))}
				@abort=${(event: Event) =>
					this.dispatchEvent(new Event(event.type, event))}
			/>
		`;
	}
	@property({ type: String }) crossOrigin?: string;
	@property({ type: Boolean }) isMap?: boolean;
	@property({ type: String }) name?: string;
	@property({ type: String }) referrerPolicy?: string;
	@property({ type: String }) sizes?: string;
	@property({ type: String }) useMap?: string;
}

declare global {
	interface HTMLElementTagNameMap {
		'unpic-img': UnpicImg;
	}
}
