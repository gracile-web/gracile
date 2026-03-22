// TODO: Refactor with Gracile code-base style.
/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

// import type { Signal } from '@lit-labs/preact-signals';
// import type { TemplateResult } from 'lit';

import * as csstype from 'csstype';

// Lit-shaped types (extracted)

/**
 * An object that holds a ref value.
 */
declare class Ref<T = Element> {
	/**
	 * The current Element value of the ref, or else `undefined` if the ref is no
	 * longer rendered.
	 */
	readonly value?: T;
}
export type RefOrCallback<T = Element> = Ref<T> | ((el: T | undefined) => void);
/**
 * A key-value set of class names to truthy values.
 */
export interface ClassInfo {
	readonly [name: string]: string | boolean | number;
}
export type ClassValue =
	| ClassArray
	| ClassDictionary
	| string
	| number
	| bigint
	| null
	| boolean
	| undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];

/**
 * Based on JSX types for Surplus and Inferno and adapted for `dom-expressions`,
 * and Gracile.
 *
 * https://github.com/adamhaile/surplus/blob/master/index.d.ts
 * https://github.com/infernojs/inferno/blob/master/packages/inferno/src/core/types.ts
 */

declare global {
	type DOMElement = Element;

	export namespace JSX {
		// type Element = ElementBare | Signal<ElementBare>;
		// type ElementBare =
		// 	| Node
		// 	| ArrayElement
		// 	| (string & {})
		// 	| number
		// 	| boolean
		// 	| null
		// 	| undefined
		// 	| TemplateResult;

		type LitTemplate = unknown; // Match Lit HTML signature

		interface ArrayElement extends Array<LitTemplate> {}

		interface ElementClass {
			// empty, libs can define requirements downstream
		}

		interface ElementAttributesProperty {
			// empty, libs can define requirements downstream
		}

		interface ElementChildrenAttribute {
			children: {};
		}

		interface EventHandler<T, E extends Event> {
			(
				e: E & {
					currentTarget: T;
					target: DOMElement;
				},
			): void;
		}

		interface BoundEventHandler<T, E extends Event> {
			0: (
				data: any,
				e: E & {
					currentTarget: T;
					target: DOMElement;
				},
			) => void;
			1: any;
		}

		type EventHandlerUnion<T, E extends Event> =
			| EventHandler<T, E>
			| BoundEventHandler<T, E>;

		interface InputEventHandler<T, E extends InputEvent> {
			(
				e: E & {
					currentTarget: T;
					target: T extends
						| HTMLInputElement
						| HTMLSelectElement
						| HTMLTextAreaElement
						? T
						: DOMElement;
				},
			): void;
		}

		interface BoundInputEventHandler<T, E extends InputEvent> {
			0: (
				data: any,
				e: E & {
					currentTarget: T;
					target: T extends
						| HTMLInputElement
						| HTMLSelectElement
						| HTMLTextAreaElement
						? T
						: DOMElement;
				},
			) => void;
			1: any;
		}

		type InputEventHandlerUnion<T, E extends InputEvent> =
			| InputEventHandler<T, E>
			| BoundInputEventHandler<T, E>;

		interface ChangeEventHandler<T, E extends Event> {
			(
				e: E & {
					currentTarget: T;
					target: T extends
						| HTMLInputElement
						| HTMLSelectElement
						| HTMLTextAreaElement
						? T
						: DOMElement;
				},
			): void;
		}

		interface BoundChangeEventHandler<T, E extends Event> {
			0: (
				data: any,
				e: E & {
					currentTarget: T;
					target: T extends
						| HTMLInputElement
						| HTMLSelectElement
						| HTMLTextAreaElement
						? T
						: DOMElement;
				},
			) => void;
			1: any;
		}

		type ChangeEventHandlerUnion<T, E extends Event> =
			| ChangeEventHandler<T, E>
			| BoundChangeEventHandler<T, E>;

		interface FocusEventHandler<T, E extends FocusEvent> {
			(
				e: E & {
					currentTarget: T;
					target: T extends
						| HTMLInputElement
						| HTMLSelectElement
						| HTMLTextAreaElement
						? T
						: DOMElement;
				},
			): void;
		}

		interface BoundFocusEventHandler<T, E extends FocusEvent> {
			0: (
				data: any,
				e: E & {
					currentTarget: T;
					target: T extends
						| HTMLInputElement
						| HTMLSelectElement
						| HTMLTextAreaElement
						? T
						: DOMElement;
				},
			) => void;
			1: any;
		}

		type FocusEventHandlerUnion<T, E extends FocusEvent> =
			| FocusEventHandler<T, E>
			| BoundFocusEventHandler<T, E>;

		const SERIALIZABLE: unique symbol;
		interface SerializableAttributeValue {
			toString(): string;
			[SERIALIZABLE]: never;
		}

		interface CommonAttributes<T> {
			'for:key'?: Key | null | undefined;
		}

		interface IntrinsicAttributes<T> extends CommonAttributes<T> {
			// ref?: (ref: T) => void;
			// ref?: unknown | ((e: unknown) => void) | undefined;
			// class?: string | undefined;
			// as: T;
		}

		type CssCustomProperty = { [key: `--${string}`]: string };

		// Same as react
		type Key = string | number | bigint;

		interface CustomAttributes<T> extends CommonAttributes<T> {
			'use:ref'?: RefOrCallback<T>;
			'unsafe:html'?: string | undefined;
			'style:map'?: (csstype.Properties & CssCustomProperty) | undefined;
			'class:map'?: ClassInfo | undefined;
			'class:list'?: ClassValue[] | undefined;
		}

		type Accessor<T> = () => T;
		interface Directives {}

		interface DirectiveFunctions {
			[x: string]: (el: DOMElement, accessor: Accessor<any>) => void;
		}

		interface ExplicitProperties {}

		interface ExplicitAttributes {}

		interface CustomEvents {}

		interface CustomCaptureEvents {}

		type DirectiveAttributes = {
			[Key in keyof Directives as `use:${Key}`]?: Directives[Key];
		};

		type DirectiveFunctionAttributes<T> = {
			[K in keyof DirectiveFunctions as string extends K
				? never
				: `use:${K}`]?: DirectiveFunctions[K] extends (
				el: infer E, // will be unknown if not provided
				...rest: infer R // use rest so that we can check whether it's provided or not
			) => void
				? T extends E // everything extends unknown if E is unknown
					? R extends [infer A] // check if has accessor provided
						? A extends Accessor<infer V>
							? V // it's an accessor
							: never // it isn't, type error
						: true // no accessor provided
					: never // T is the wrong element
				: never; // it isn't a function
		};

		// type PropAttributes = {
		// 	[Key in keyof ExplicitProperties as `prop:${Key}`]?: ExplicitProperties[Key];
		// };

		// type AttrAttributes = {
		// 	[Key in keyof ExplicitAttributes as `attr:${Key}`]?: ExplicitAttributes[Key];
		// };

		// type BoolAttributes = {
		// 	[Key in keyof ExplicitAttributes as `bool:${Key}`]?: ExplicitAttributes[Key];
		// };

		// type IfDefinedAttributes = {
		// 	[Key in keyof ExplicitAttributes as `if:${Key}`]?: ExplicitAttributes[Key];
		// };

		type OnAttributes<T> = {
			[Key in keyof CustomEvents as `on:${Key}`]?: EventHandler<
				T,
				CustomEvents[Key]
			>;
		};

		type OnCaptureAttributes<T> = {
			[Key in keyof CustomCaptureEvents as `oncapture:${Key}`]?: EventHandler<
				T,
				CustomCaptureEvents[Key]
			>;
		};
		interface DOMAttributes<T>
			extends
				CustomAttributes<T>,
				DirectiveAttributes,
				DirectiveFunctionAttributes<T>,
				// NOTE: Duplicate?
				// PropAttributes,
				// AttrAttributes,
				// BoolAttributes,
				// IfDefinedAttributes,
				//
				OnAttributes<T>,
				OnCaptureAttributes<T>,
				// CustomEventHandlersCamelCase<T>, // NOTE: Disabled.
				CustomEventHandlersLowerCase,
				CustomEventHandlersLowerCaseNamespaced<T> {
			children?: LitTemplate | undefined;
			innerHTML?: string | undefined;
			innerText?: string | number | undefined;
			textContent?: string | number | undefined;
			// camel case events // NOTE: Disabled.
			// onCopy?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			// onCut?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			// onPaste?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			// onCompositionEnd?: EventHandlerUnion<T, CompositionEvent> | undefined;
			// onCompositionStart?: EventHandlerUnion<T, CompositionEvent> | undefined;
			// onCompositionUpdate?: EventHandlerUnion<T, CompositionEvent> | undefined;
			// onFocusOut?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			// onFocusIn?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			// onEncrypted?: EventHandlerUnion<T, Event> | undefined;
			// onDragExit?: EventHandlerUnion<T, DragEvent> | undefined;
			// lower case events - inline
			oncopy?: string | undefined;
			oncut?: string | undefined;
			onpaste?: string | undefined;
			oncompositionend?: string | undefined;
			oncompositionstart?: string | undefined;
			oncompositionupdate?: string | undefined;
			onfocusout?: string | undefined;
			onfocusin?: string | undefined;
			onencrypted?: string | undefined;
			ondragexit?: string | undefined;
			// lower case events - binded
			'on:copy'?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			'on:cut'?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			'on:paste'?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			'on:compositionend'?: EventHandlerUnion<T, CompositionEvent> | undefined;
			'on:compositionstart'?:
				| EventHandlerUnion<T, CompositionEvent>
				| undefined;
			'on:compositionupdate'?:
				| EventHandlerUnion<T, CompositionEvent>
				| undefined;
			'on:focusout'?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			'on:focusin'?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			'on:encrypted'?: EventHandlerUnion<T, Event> | undefined;
			'on:dragexit'?: EventHandlerUnion<T, DragEvent> | undefined;
		}

		interface CustomEventHandlersCamelCase<T> {
			onAbort?: EventHandlerUnion<T, Event> | undefined;
			onAnimationEnd?: EventHandlerUnion<T, AnimationEvent> | undefined;
			onAnimationIteration?: EventHandlerUnion<T, AnimationEvent> | undefined;
			onAnimationStart?: EventHandlerUnion<T, AnimationEvent> | undefined;
			onAuxClick?: EventHandlerUnion<T, MouseEvent> | undefined;
			onBeforeInput?: InputEventHandlerUnion<T, InputEvent> | undefined;
			onBeforeToggle?: EventHandlerUnion<T, ToggleEvent> | undefined;
			onBlur?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			onCanPlay?: EventHandlerUnion<T, Event> | undefined;
			onCanPlayThrough?: EventHandlerUnion<T, Event> | undefined;
			onChange?: ChangeEventHandlerUnion<T, Event> | undefined;
			onClick?: EventHandlerUnion<T, MouseEvent> | undefined;
			onContextMenu?: EventHandlerUnion<T, MouseEvent> | undefined;
			onDblClick?: EventHandlerUnion<T, MouseEvent> | undefined;
			onDrag?: EventHandlerUnion<T, DragEvent> | undefined;
			onDragEnd?: EventHandlerUnion<T, DragEvent> | undefined;
			onDragEnter?: EventHandlerUnion<T, DragEvent> | undefined;
			onDragLeave?: EventHandlerUnion<T, DragEvent> | undefined;
			onDragOver?: EventHandlerUnion<T, DragEvent> | undefined;
			onDragStart?: EventHandlerUnion<T, DragEvent> | undefined;
			onDrop?: EventHandlerUnion<T, DragEvent> | undefined;
			onDurationChange?: EventHandlerUnion<T, Event> | undefined;
			onEmptied?: EventHandlerUnion<T, Event> | undefined;
			onEnded?: EventHandlerUnion<T, Event> | undefined;
			onError?: EventHandlerUnion<T, Event> | undefined;
			onFocus?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			onGotPointerCapture?: EventHandlerUnion<T, PointerEvent> | undefined;
			onInput?: InputEventHandlerUnion<T, InputEvent> | undefined;
			onInvalid?: EventHandlerUnion<T, Event> | undefined;
			onKeyDown?: EventHandlerUnion<T, KeyboardEvent> | undefined;
			onKeyPress?: EventHandlerUnion<T, KeyboardEvent> | undefined;
			onKeyUp?: EventHandlerUnion<T, KeyboardEvent> | undefined;
			onLoad?: EventHandlerUnion<T, Event> | undefined;
			onLoadedData?: EventHandlerUnion<T, Event> | undefined;
			onLoadedMetadata?: EventHandlerUnion<T, Event> | undefined;
			onLoadStart?: EventHandlerUnion<T, Event> | undefined;
			onLostPointerCapture?: EventHandlerUnion<T, PointerEvent> | undefined;
			onMouseDown?: EventHandlerUnion<T, MouseEvent> | undefined;
			onMouseEnter?: EventHandlerUnion<T, MouseEvent> | undefined;
			onMouseLeave?: EventHandlerUnion<T, MouseEvent> | undefined;
			onMouseMove?: EventHandlerUnion<T, MouseEvent> | undefined;
			onMouseOut?: EventHandlerUnion<T, MouseEvent> | undefined;
			onMouseOver?: EventHandlerUnion<T, MouseEvent> | undefined;
			onMouseUp?: EventHandlerUnion<T, MouseEvent> | undefined;
			onPause?: EventHandlerUnion<T, Event> | undefined;
			onPlay?: EventHandlerUnion<T, Event> | undefined;
			onPlaying?: EventHandlerUnion<T, Event> | undefined;
			onPointerCancel?: EventHandlerUnion<T, PointerEvent> | undefined;
			onPointerDown?: EventHandlerUnion<T, PointerEvent> | undefined;
			onPointerEnter?: EventHandlerUnion<T, PointerEvent> | undefined;
			onPointerLeave?: EventHandlerUnion<T, PointerEvent> | undefined;
			onPointerMove?: EventHandlerUnion<T, PointerEvent> | undefined;
			onPointerOut?: EventHandlerUnion<T, PointerEvent> | undefined;
			onPointerOver?: EventHandlerUnion<T, PointerEvent> | undefined;
			onPointerUp?: EventHandlerUnion<T, PointerEvent> | undefined;
			onProgress?: EventHandlerUnion<T, Event> | undefined;
			onRateChange?: EventHandlerUnion<T, Event> | undefined;
			onReset?: EventHandlerUnion<T, Event> | undefined;
			onScroll?: EventHandlerUnion<T, Event> | undefined;
			onScrollEnd?: EventHandlerUnion<T, Event> | undefined;
			onSeeked?: EventHandlerUnion<T, Event> | undefined;
			onSeeking?: EventHandlerUnion<T, Event> | undefined;
			onSelect?: EventHandlerUnion<T, UIEvent> | undefined;
			onStalled?: EventHandlerUnion<T, Event> | undefined;
			onSubmit?:
				| EventHandlerUnion<T, Event & { submitter: HTMLElement }>
				| undefined;
			onSuspend?: EventHandlerUnion<T, Event> | undefined;
			onTimeUpdate?: EventHandlerUnion<T, Event> | undefined;
			onToggle?: EventHandlerUnion<T, ToggleEvent> | undefined;
			onTouchCancel?: EventHandlerUnion<T, TouchEvent> | undefined;
			onTouchEnd?: EventHandlerUnion<T, TouchEvent> | undefined;
			onTouchMove?: EventHandlerUnion<T, TouchEvent> | undefined;
			onTouchStart?: EventHandlerUnion<T, TouchEvent> | undefined;
			onTransitionStart?: EventHandlerUnion<T, TransitionEvent> | undefined;
			onTransitionEnd?: EventHandlerUnion<T, TransitionEvent> | undefined;
			onTransitionRun?: EventHandlerUnion<T, TransitionEvent> | undefined;
			onTransitionCancel?: EventHandlerUnion<T, TransitionEvent> | undefined;
			onVolumeChange?: EventHandlerUnion<T, Event> | undefined;
			onWaiting?: EventHandlerUnion<T, Event> | undefined;
			onWheel?: EventHandlerUnion<T, WheelEvent> | undefined;
		}

		/**
		 * @type {GlobalEventHandlers}
		 */
		interface CustomEventHandlersLowerCase {
			onabort?: string | undefined;
			onanimationend?: string | undefined;
			onanimationiteration?: string | undefined;
			onanimationstart?: string | undefined;
			onauxclick?: string | undefined;
			onbeforeinput?: string | undefined;
			onbeforetoggle?: string | undefined;
			onblur?: string | undefined;
			oncanplay?: string | undefined;
			oncanplaythrough?: string | undefined;
			onchange?: string | undefined;
			onclick?: string | undefined;
			oncontextmenu?: string | undefined;
			ondblclick?: string | undefined;
			ondrag?: string | undefined;
			ondragend?: string | undefined;
			ondragenter?: string | undefined;
			ondragleave?: string | undefined;
			ondragover?: string | undefined;
			ondragstart?: string | undefined;
			ondrop?: string | undefined;
			ondurationchange?: string | undefined;
			onemptied?: string | undefined;
			onended?: string | undefined;
			onerror?: string | undefined;
			onfocus?: string | undefined;
			ongotpointercapture?: string | undefined;
			oninput?: string | undefined;
			oninvalid?: string | undefined;
			onkeydown?: string | undefined;
			onkeypress?: string | undefined;
			onkeyup?: string | undefined;
			onload?: string | undefined;
			onloadeddata?: string | undefined;
			onloadedmetadata?: string | undefined;
			onloadstart?: string | undefined;
			onlostpointercapture?: string | undefined;
			onmousedown?: string | undefined;
			onmouseenter?: string | undefined;
			onmouseleave?: string | undefined;
			onmousemove?: string | undefined;
			onmouseout?: string | undefined;
			onmouseover?: string | undefined;
			onmouseup?: string | undefined;
			onpause?: string | undefined;
			onplay?: string | undefined;
			onplaying?: string | undefined;
			onpointercancel?: string | undefined;
			onpointerdown?: string | undefined;
			onpointerenter?: string | undefined;
			onpointerleave?: string | undefined;
			onpointermove?: string | undefined;
			onpointerout?: string | undefined;
			onpointerover?: string | undefined;
			onpointerup?: string | undefined;
			onprogress?: string | undefined;
			onratechange?: string | undefined;
			onreset?: string | undefined;
			onscroll?: string | undefined;
			onscrollend?: string | undefined;
			onseeked?: string | undefined;
			onseeking?: string | undefined;
			onselect?: string | undefined;
			onstalled?: string | undefined;
			onsubmit?: string | undefined;
			onsuspend?: string | undefined;
			ontimeupdate?: string | undefined;
			ontoggle?: string | undefined;
			ontouchcancel?: string | undefined;
			ontouchend?: string | undefined;
			ontouchmove?: string | undefined;
			ontouchstart?: string | undefined;
			ontransitionstart?: string | undefined;
			ontransitionend?: string | undefined;
			ontransitionrun?: string | undefined;
			ontransitioncancel?: string | undefined;
			onvolumechange?: string | undefined;
			onwaiting?: string | undefined;
			onwheel?: string | undefined;
		}

		/**
		 * @type {GlobalEventHandlers}
		 */
		interface CustomEventHandlersLowerCaseNamespaced<T> {
			'on:abort'?: EventHandlerUnion<T, Event> | undefined;
			'on:animationend'?: EventHandlerUnion<T, AnimationEvent> | undefined;
			'on:animationiteration'?:
				| EventHandlerUnion<T, AnimationEvent>
				| undefined;
			'on:animationstart'?: EventHandlerUnion<T, AnimationEvent> | undefined;
			'on:auxclick'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:beforeinput'?: InputEventHandlerUnion<T, InputEvent> | undefined;
			'on:beforetoggle'?: EventHandlerUnion<T, ToggleEvent> | undefined;
			'on:blur'?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			'on:canplay'?: EventHandlerUnion<T, Event> | undefined;
			'on:canplaythrough'?: EventHandlerUnion<T, Event> | undefined;
			'on:change'?: ChangeEventHandlerUnion<T, Event> | undefined;
			'on:click'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:contextmenu'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:dblclick'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:drag'?: EventHandlerUnion<T, DragEvent> | undefined;
			'on:dragend'?: EventHandlerUnion<T, DragEvent> | undefined;
			'on:dragenter'?: EventHandlerUnion<T, DragEvent> | undefined;
			'on:dragleave'?: EventHandlerUnion<T, DragEvent> | undefined;
			'on:dragover'?: EventHandlerUnion<T, DragEvent> | undefined;
			'on:dragstart'?: EventHandlerUnion<T, DragEvent> | undefined;
			'on:drop'?: EventHandlerUnion<T, DragEvent> | undefined;
			'on:durationchange'?: EventHandlerUnion<T, Event> | undefined;
			'on:emptied'?: EventHandlerUnion<T, Event> | undefined;
			'on:ended'?: EventHandlerUnion<T, Event> | undefined;
			'on:error'?: EventHandlerUnion<T, Event> | undefined;
			'on:focus'?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			'on:gotpointercapture'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:input'?: InputEventHandlerUnion<T, InputEvent> | undefined;
			'on:invalid'?: EventHandlerUnion<T, Event> | undefined;
			'on:keydown'?: EventHandlerUnion<T, KeyboardEvent> | undefined;
			'on:keypress'?: EventHandlerUnion<T, KeyboardEvent> | undefined;
			'on:keyup'?: EventHandlerUnion<T, KeyboardEvent> | undefined;
			'on:load'?: EventHandlerUnion<T, Event> | undefined;
			'on:loadeddata'?: EventHandlerUnion<T, Event> | undefined;
			'on:loadedmetadata'?: EventHandlerUnion<T, Event> | undefined;
			'on:loadstart'?: EventHandlerUnion<T, Event> | undefined;
			'on:lostpointercapture'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:mousedown'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:mouseenter'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:mouseleave'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:mousemove'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:mouseout'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:mouseover'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:mouseup'?: EventHandlerUnion<T, MouseEvent> | undefined;
			'on:pause'?: EventHandlerUnion<T, Event> | undefined;
			'on:play'?: EventHandlerUnion<T, Event> | undefined;
			'on:playing'?: EventHandlerUnion<T, Event> | undefined;
			'on:pointercancel'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:pointerdown'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:pointerenter'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:pointerleave'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:pointermove'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:pointerout'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:pointerover'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:pointerup'?: EventHandlerUnion<T, PointerEvent> | undefined;
			'on:progress'?: EventHandlerUnion<T, Event> | undefined;
			'on:ratechange'?: EventHandlerUnion<T, Event> | undefined;
			'on:reset'?: EventHandlerUnion<T, Event> | undefined;
			'on:scroll'?: EventHandlerUnion<T, Event> | undefined;
			'on:scrollend'?: EventHandlerUnion<T, Event> | undefined;
			'on:seeked'?: EventHandlerUnion<T, Event> | undefined;
			'on:seeking'?: EventHandlerUnion<T, Event> | undefined;
			'on:select'?: EventHandlerUnion<T, UIEvent> | undefined;
			'on:stalled'?: EventHandlerUnion<T, Event> | undefined;
			'on:submit'?: EventHandlerUnion<T, Event & { submitter: HTMLElement }>;
			'on:suspend'?: EventHandlerUnion<T, Event> | undefined;
			'on:timeupdate'?: EventHandlerUnion<T, Event> | undefined;
			'on:toggle'?: EventHandlerUnion<T, ToggleEvent> | undefined;
			'on:touchcancel'?: EventHandlerUnion<T, TouchEvent> | undefined;
			'on:touchend'?: EventHandlerUnion<T, TouchEvent> | undefined;
			'on:touchmove'?: EventHandlerUnion<T, TouchEvent> | undefined;
			'on:touchstart'?: EventHandlerUnion<T, TouchEvent> | undefined;
			'on:transitionstart'?: EventHandlerUnion<T, TransitionEvent> | undefined;
			'on:transitionend'?: EventHandlerUnion<T, TransitionEvent> | undefined;
			'on:transitionrun'?: EventHandlerUnion<T, TransitionEvent> | undefined;
			'on:transitioncancel'?: EventHandlerUnion<T, TransitionEvent> | undefined;
			'on:volumechange'?: EventHandlerUnion<T, Event> | undefined;
			'on:waiting'?: EventHandlerUnion<T, Event> | undefined;
			'on:wheel'?: EventHandlerUnion<T, WheelEvent> | undefined;

			// lower case events - binded
			'on:copy'?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			'on:cut'?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			'on:paste'?: EventHandlerUnion<T, ClipboardEvent> | undefined;
			'on:compositionend'?: EventHandlerUnion<T, CompositionEvent> | undefined;
			'on:compositionstart'?:
				| EventHandlerUnion<T, CompositionEvent>
				| undefined;
			'on:compositionupdate'?:
				| EventHandlerUnion<T, CompositionEvent>
				| undefined;
			'on:focusout'?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			'on:focusin'?: FocusEventHandlerUnion<T, FocusEvent> | undefined;
			'on:encrypted'?: EventHandlerUnion<T, Event> | undefined;
			'on:dragexit'?: EventHandlerUnion<T, DragEvent> | undefined;
		}

		interface CSSProperties extends csstype.PropertiesHyphen {
			// Override
			// [key: `-${string}`]: string | number | undefined;
		}

		// interface CSSProperties extends csstype.PropertiesHyphen {
		// 	// Override
		// 	[key: `-${string}`]: string | number | undefined;
		// }

		type HTMLAutocapitalize =
			| 'off'
			| 'none'
			| 'on'
			| 'sentences'
			| 'words'
			| 'characters';

		type HTMLDir = 'ltr' | 'rtl' | 'auto';

		type HTMLFormEncType =
			| 'application/x-www-form-urlencoded'
			| 'multipart/form-data'
			| 'text/plain';

		type HTMLFormMethod = 'post' | 'get' | 'dialog';

		type HTMLCrossorigin = 'anonymous' | 'use-credentials' | '';

		type HTMLReferrerPolicy =
			| 'no-referrer'
			| 'no-referrer-when-downgrade'
			| 'origin'
			| 'origin-when-cross-origin'
			| 'same-origin'
			| 'strict-origin'
			| 'strict-origin-when-cross-origin'
			| 'unsafe-url';

		type HTMLIframeSandbox =
			| 'allow-downloads-without-user-activation'
			| 'allow-downloads'
			| 'allow-forms'
			| 'allow-modals'
			| 'allow-orientation-lock'
			| 'allow-pointer-lock'
			| 'allow-popups'
			| 'allow-popups-to-escape-sandbox'
			| 'allow-presentation'
			| 'allow-same-origin'
			| 'allow-scripts'
			| 'allow-storage-access-by-user-activation'
			| 'allow-top-navigation'
			| 'allow-top-navigation-by-user-activation'
			| 'allow-top-navigation-to-custom-protocols';

		type HTMLLinkAs =
			| 'audio'
			| 'document'
			| 'embed'
			| 'fetch'
			| 'font'
			| 'image'
			| 'object'
			| 'script'
			| 'style'
			| 'track'
			| 'video'
			| 'worker';

		// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
		interface AriaAttributes {
			/** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
			'aria-activedescendant'?: string | undefined;
			/** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
			'aria-atomic'?: boolean | 'false' | 'true' | undefined;
			/**
			 * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
			 * presented if they are made.
			 */
			'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
			/** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
			'aria-busy'?: boolean | 'false' | 'true' | undefined;
			/**
			 * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
			 * @see aria-pressed @see aria-selected.
			 */
			'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
			/**
			 * Defines the total number of columns in a table, grid, or treegrid.
			 * @see aria-colindex.
			 */
			'aria-colcount'?: number | string | undefined;
			/**
			 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
			 * @see aria-colcount @see aria-colspan.
			 */
			'aria-colindex'?: number | string | undefined;
			/**
			 * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
			 * @see aria-colindex @see aria-rowspan.
			 */
			'aria-colspan'?: number | string | undefined;
			/**
			 * Identifies the element (or elements) whose contents or presence are controlled by the current element.
			 * @see aria-owns.
			 */
			'aria-controls'?: string | undefined;
			/** Indicates the element that represents the current item within a container or set of related elements. */
			'aria-current'?:
				| boolean
				| 'false'
				| 'true'
				| 'page'
				| 'step'
				| 'location'
				| 'date'
				| 'time'
				| undefined;
			/**
			 * Identifies the element (or elements) that describes the object.
			 * @see aria-labelledby
			 */
			'aria-describedby'?: string | undefined;
			/**
			 * Identifies the element that provides a detailed, extended description for the object.
			 * @see aria-describedby.
			 */
			'aria-details'?: string | undefined;
			/**
			 * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
			 * @see aria-hidden @see aria-readonly.
			 */
			'aria-disabled'?: boolean | 'false' | 'true' | undefined;
			/**
			 * Indicates what functions can be performed when a dragged object is released on the drop target.
			 * @deprecated in ARIA 1.1
			 */
			'aria-dropeffect'?:
				| 'none'
				| 'copy'
				| 'execute'
				| 'link'
				| 'move'
				| 'popup'
				| undefined;
			/**
			 * Identifies the element that provides an error message for the object.
			 * @see aria-invalid @see aria-describedby.
			 */
			'aria-errormessage'?: string | undefined;
			/** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
			'aria-expanded'?: boolean | 'false' | 'true' | undefined;
			/**
			 * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
			 * allows assistive technology to override the general default of reading in document source order.
			 */
			'aria-flowto'?: string | undefined;
			/**
			 * Indicates an element's "grabbed" state in a drag-and-drop operation.
			 * @deprecated in ARIA 1.1
			 */
			'aria-grabbed'?: boolean | 'false' | 'true' | undefined;
			/** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
			'aria-haspopup'?:
				| boolean
				| 'false'
				| 'true'
				| 'menu'
				| 'listbox'
				| 'tree'
				| 'grid'
				| 'dialog'
				| undefined;
			/**
			 * Indicates whether the element is exposed to an accessibility API.
			 * @see aria-disabled.
			 */
			'aria-hidden'?: boolean | 'false' | 'true' | undefined;
			/**
			 * Indicates the entered value does not conform to the format expected by the application.
			 * @see aria-errormessage.
			 */
			'aria-invalid'?:
				| boolean
				| 'false'
				| 'true'
				| 'grammar'
				| 'spelling'
				| undefined;
			/** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
			'aria-keyshortcuts'?: string | undefined;
			/**
			 * Defines a string value that labels the current element.
			 * @see aria-labelledby.
			 */
			'aria-label'?: string | undefined;
			/**
			 * Identifies the element (or elements) that labels the current element.
			 * @see aria-describedby.
			 */
			'aria-labelledby'?: string | undefined;
			/** Defines the hierarchical level of an element within a structure. */
			'aria-level'?: number | string | undefined;
			/** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
			'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
			/** Indicates whether an element is modal when displayed. */
			'aria-modal'?: boolean | 'false' | 'true' | undefined;
			/** Indicates whether a text box accepts multiple lines of input or only a single line. */
			'aria-multiline'?: boolean | 'false' | 'true' | undefined;
			/** Indicates that the user may select more than one item from the current selectable descendants. */
			'aria-multiselectable'?: boolean | 'false' | 'true' | undefined;
			/** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
			'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
			/**
			 * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
			 * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
			 * @see aria-controls.
			 */
			'aria-owns'?: string | undefined;
			/**
			 * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
			 * A hint could be a sample value or a brief description of the expected format.
			 */
			'aria-placeholder'?: string | undefined;
			/**
			 * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
			 * @see aria-setsize.
			 */
			'aria-posinset'?: number | string | undefined;
			/**
			 * Indicates the current "pressed" state of toggle buttons.
			 * @see aria-checked @see aria-selected.
			 */
			'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
			/**
			 * Indicates that the element is not editable, but is otherwise operable.
			 * @see aria-disabled.
			 */
			'aria-readonly'?: boolean | 'false' | 'true' | undefined;
			/**
			 * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
			 * @see aria-atomic.
			 */
			'aria-relevant'?:
				| 'additions'
				| 'additions removals'
				| 'additions text'
				| 'all'
				| 'removals'
				| 'removals additions'
				| 'removals text'
				| 'text'
				| 'text additions'
				| 'text removals';
			/** Indicates that user input is required on the element before a form may be submitted. */
			'aria-required'?: boolean | 'false' | 'true' | undefined;
			/** Defines a human-readable, author-localized description for the role of an element. */
			'aria-roledescription'?: string | undefined;
			/**
			 * Defines the total number of rows in a table, grid, or treegrid.
			 * @see aria-rowindex.
			 */
			'aria-rowcount'?: number | string | undefined;
			/**
			 * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
			 * @see aria-rowcount @see aria-rowspan.
			 */
			'aria-rowindex'?: number | string | undefined;
			/**
			 * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
			 * @see aria-rowindex @see aria-colspan.
			 */
			'aria-rowspan'?: number | string | undefined;
			/**
			 * Indicates the current "selected" state of various widgets.
			 * @see aria-checked @see aria-pressed.
			 */
			'aria-selected'?: boolean | 'false' | 'true' | undefined;
			/**
			 * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
			 * @see aria-posinset.
			 */
			'aria-setsize'?: number | string | undefined;
			/** Indicates if items in a table or grid are sorted in ascending or descending order. */
			'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
			/** Defines the maximum allowed value for a range widget. */
			'aria-valuemax'?: number | string | undefined;
			/** Defines the minimum allowed value for a range widget. */
			'aria-valuemin'?: number | string | undefined;
			/**
			 * Defines the current value for a range widget.
			 * @see aria-valuetext.
			 */
			'aria-valuenow'?: number | string | undefined;
			/** Defines the human readable text alternative of aria-valuenow for a range widget. */
			'aria-valuetext'?: string | undefined;
			role?:
				| 'alert'
				| 'alertdialog'
				| 'application'
				| 'article'
				| 'banner'
				| 'button'
				| 'cell'
				| 'checkbox'
				| 'columnheader'
				| 'combobox'
				| 'complementary'
				| 'contentinfo'
				| 'definition'
				| 'dialog'
				| 'directory'
				| 'document'
				| 'feed'
				| 'figure'
				| 'form'
				| 'grid'
				| 'gridcell'
				| 'group'
				| 'heading'
				| 'img'
				| 'link'
				| 'list'
				| 'listbox'
				| 'listitem'
				| 'log'
				| 'main'
				| 'marquee'
				| 'math'
				| 'menu'
				| 'menubar'
				| 'menuitem'
				| 'menuitemcheckbox'
				| 'menuitemradio'
				| 'meter'
				| 'navigation'
				| 'none'
				| 'note'
				| 'option'
				| 'presentation'
				| 'progressbar'
				| 'radio'
				| 'radiogroup'
				| 'region'
				| 'row'
				| 'rowgroup'
				| 'rowheader'
				| 'scrollbar'
				| 'search'
				| 'searchbox'
				| 'separator'
				| 'slider'
				| 'spinbutton'
				| 'status'
				| 'switch'
				| 'tab'
				| 'table'
				| 'tablist'
				| 'tabpanel'
				| 'term'
				| 'textbox'
				| 'timer'
				| 'toolbar'
				| 'tooltip'
				| 'tree'
				| 'treegrid'
				| 'treeitem';
		}

		// TODO: Should we allow this?
		// type ClassKeys = `class:${string}`;
		// type CSSKeys = Exclude<keyof csstype.PropertiesHyphen, `-${string}`>;

		// type CSSAttributes = {
		//   [key in CSSKeys as `style:${key}`]: csstype.PropertiesHyphen[key];
		// };

		interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
			// [key: ClassKeys]: boolean;
			// All HTML Elements can have autofocus since ~2019 (https://github.com/mozilla/standards-positions/issues/195)
			autofocus?: boolean | undefined;

			accessKey?: string | undefined;
			class?: string | undefined;
			contenteditable?: boolean | 'plaintext-only' | 'inherit' | undefined;
			contextmenu?: string | undefined;
			dir?: HTMLDir | undefined;
			draggable?: boolean | 'false' | 'true' | undefined;
			hidden?: boolean | 'hidden' | 'until-found' | undefined;
			id?: string | undefined;
			inert?: boolean | undefined;
			lang?: string | undefined;
			spellcheck?: boolean | undefined;
			style?: CSSProperties | string | undefined;
			tabindex?: number | string | undefined;
			title?: string | undefined;
			translate?: 'yes' | 'no' | undefined;
			about?: string | undefined;
			datatype?: string | undefined;
			inlist?: any | undefined;
			popover?: boolean | 'manual' | 'auto' | undefined;
			prefix?: string | undefined;
			property?: string | undefined;
			resource?: string | undefined;
			typeof?: string | undefined;
			vocab?: string | undefined;
			autocapitalize?: HTMLAutocapitalize | undefined;
			slot?: string | undefined;
			color?: string | undefined;
			itemprop?: string | undefined;
			itemscope?: boolean | undefined;
			itemtype?: string | undefined;
			itemid?: string | undefined;
			itemref?: string | undefined;
			part?: string | undefined;
			exportparts?: string | undefined;
			inputmode?:
				| 'none'
				| 'text'
				| 'tel'
				| 'url'
				| 'email'
				| 'numeric'
				| 'decimal'
				| 'search'
				| undefined;
			contentEditable?: boolean | 'plaintext-only' | 'inherit' | undefined;
			contextMenu?: string | undefined;
			tabIndex?: number | string | undefined;
			autoCapitalize?: HTMLAutocapitalize | undefined;
			itemProp?: string | undefined;
			itemScope?: boolean | undefined;
			itemType?: string | undefined;
			itemId?: string | undefined;
			itemRef?: string | undefined;
			exportParts?: string | undefined;
			inputMode?:
				| 'none'
				| 'text'
				| 'tel'
				| 'url'
				| 'email'
				| 'numeric'
				| 'decimal'
				| 'search'
				| undefined;
		}

		interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
			download?: any | undefined;
			href?: string | undefined;
			hreflang?: string | undefined;
			media?: string | undefined;
			ping?: string | undefined;
			referrerpolicy?: HTMLReferrerPolicy | undefined;
			rel?: string | undefined;
			target?: string | undefined;
			type?: string | undefined;
			referrerPolicy?: HTMLReferrerPolicy | undefined;
		}

		interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

		interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
			alt?: string | undefined;
			coords?: string | undefined;
			download?: any | undefined;
			href?: string | undefined;
			hreflang?: string | undefined;
			ping?: string | undefined;
			referrerpolicy?: HTMLReferrerPolicy | undefined;
			rel?: string | undefined;
			shape?: 'rect' | 'circle' | 'poly' | 'default' | undefined;
			target?: string | undefined;
			referrerPolicy?: HTMLReferrerPolicy | undefined;
		}

		interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
			href?: string | undefined;
			target?: string | undefined;
		}

		interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
			cite?: string | undefined;
		}

		interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
			disabled?: boolean | undefined;
			form?: string | undefined;
			formaction?: string | SerializableAttributeValue | undefined;
			formenctype?: HTMLFormEncType | undefined;
			formmethod?: HTMLFormMethod | undefined;
			formnovalidate?: boolean | undefined;
			formtarget?: string | undefined;
			popovertarget?: string | undefined;
			popovertargetaction?: 'hide' | 'show' | 'toggle' | undefined;
			name?: string | undefined;
			type?: 'submit' | 'reset' | 'button' | undefined;
			value?: string | undefined;
			formAction?: string | SerializableAttributeValue | undefined;
			formEnctype?: HTMLFormEncType | undefined;
			formMethod?: HTMLFormMethod | undefined;
			formNoValidate?: boolean | undefined;
			formTarget?: string | undefined;
			popoverTarget?: string | undefined;
			popoverTargetAction?: 'hide' | 'show' | 'toggle' | undefined;
		}

		interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
			width?: number | string | undefined;
			height?: number | string | undefined;
		}

		interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
			span?: number | string | undefined;
			width?: number | string | undefined;
		}

		interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
			span?: number | string | undefined;
		}

		interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
			value?: string | string[] | number | undefined;
		}

		interface DetailsHtmlAttributes<T> extends HTMLAttributes<T> {
			open?: boolean | undefined;
			onToggle?: EventHandlerUnion<T, Event> | undefined;
			ontoggle?: string | undefined;
		}

		interface DialogHtmlAttributes<T> extends HTMLAttributes<T> {
			open?: boolean | undefined;
			onClose?: EventHandlerUnion<T, Event> | undefined;
			onCancel?: EventHandlerUnion<T, Event> | undefined;
		}

		interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
			height?: number | string | undefined;
			src?: string | undefined;
			type?: string | undefined;
			width?: number | string | undefined;
		}

		interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
			disabled?: boolean | undefined;
			form?: string | undefined;
			name?: string | undefined;
		}

		interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
			'accept-charset'?: string | undefined;
			action?: string | SerializableAttributeValue | undefined;
			autocomplete?: string | undefined;
			encoding?: HTMLFormEncType | undefined;
			enctype?: HTMLFormEncType | undefined;
			method?: HTMLFormMethod | undefined;
			name?: string | undefined;
			novalidate?: boolean | undefined;
			target?: string | undefined;
			noValidate?: boolean | undefined;
		}

		interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
			allow?: string | undefined;
			allowfullscreen?: boolean | undefined;
			height?: number | string | undefined;
			loading?: 'eager' | 'lazy' | undefined;
			name?: string | undefined;
			referrerpolicy?: HTMLReferrerPolicy | undefined;
			sandbox?: HTMLIframeSandbox | string | undefined;
			src?: string | undefined;
			srcdoc?: string | undefined;
			width?: number | string | undefined;
			referrerPolicy?: HTMLReferrerPolicy | undefined;
		}

		interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
			alt?: string | undefined;
			crossorigin?: HTMLCrossorigin | undefined;
			decoding?: 'sync' | 'async' | 'auto' | undefined;
			height?: number | string | undefined;
			ismap?: boolean | undefined;
			isMap?: boolean | undefined;
			loading?: 'eager' | 'lazy' | undefined;
			referrerpolicy?: HTMLReferrerPolicy | undefined;
			referrerPolicy?: HTMLReferrerPolicy | undefined;
			sizes?: string | undefined;
			src?: string | undefined;
			srcset?: string | undefined;
			srcSet?: string | undefined;
			usemap?: string | undefined;
			useMap?: string | undefined;
			width?: number | string | undefined;
			crossOrigin?: HTMLCrossorigin | undefined;
			elementtiming?: string | undefined;
			fetchpriority?: 'high' | 'low' | 'auto' | undefined;
		}

		interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
			accept?: string | undefined;
			alt?: string | undefined;
			autocomplete?: string | undefined;
			autocorrect?: 'on' | 'off' | undefined;
			capture?: boolean | string | undefined;
			checked?: boolean | undefined;
			crossorigin?: HTMLCrossorigin | undefined;
			disabled?: boolean | undefined;
			enterkeyhint?:
				| 'enter'
				| 'done'
				| 'go'
				| 'next'
				| 'previous'
				| 'search'
				| 'send'
				| undefined;
			form?: string | undefined;
			formaction?: string | SerializableAttributeValue | undefined;
			formenctype?: HTMLFormEncType | undefined;
			formmethod?: HTMLFormMethod | undefined;
			formnovalidate?: boolean | undefined;
			formtarget?: string | undefined;
			height?: number | string | undefined;
			incremental?: boolean | undefined;
			list?: string | undefined;
			max?: number | string | undefined;
			maxlength?: number | string | undefined;
			min?: number | string | undefined;
			minlength?: number | string | undefined;
			multiple?: boolean | undefined;
			name?: string | undefined;
			pattern?: string | undefined;
			placeholder?: string | undefined;
			readonly?: boolean | undefined;
			results?: number | undefined;
			required?: boolean | undefined;
			size?: number | string | undefined;
			src?: string | undefined;
			step?: number | string | undefined;
			type?: string | undefined;
			value?: string | string[] | number | undefined;
			width?: number | string | undefined;
			crossOrigin?: HTMLCrossorigin | undefined;
			formAction?: string | SerializableAttributeValue | undefined;
			formEnctype?: HTMLFormEncType | undefined;
			formMethod?: HTMLFormMethod | undefined;
			formNoValidate?: boolean | undefined;
			formTarget?: string | undefined;
			maxLength?: number | string | undefined;
			minLength?: number | string | undefined;
			readOnly?: boolean | undefined;
		}

		interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
			cite?: string | undefined;
			dateTime?: string | undefined;
		}

		interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
			challenge?: string | undefined;
			disabled?: boolean | undefined;
			form?: string | undefined;
			keytype?: string | undefined;
			keyparams?: string | undefined;
			name?: string | undefined;
		}

		interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
			for?: string | undefined;
			form?: string | undefined;
		}

		interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
			value?: number | string | undefined;
		}

		interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
			as?: HTMLLinkAs | undefined;
			crossorigin?: HTMLCrossorigin | undefined;
			disabled?: boolean | undefined;
			fetchpriority?: 'high' | 'low' | 'auto' | undefined;
			href?: string | undefined;
			hreflang?: string | undefined;
			imagesizes?: string | undefined;
			imagesrcset?: string | undefined;
			integrity?: string | undefined;
			media?: string | undefined;
			referrerpolicy?: HTMLReferrerPolicy | undefined;
			rel?: string | undefined;
			sizes?: string | undefined;
			type?: string | undefined;
			crossOrigin?: HTMLCrossorigin | undefined;
			referrerPolicy?: HTMLReferrerPolicy | undefined;
		}

		interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
			name?: string | undefined;
		}

		interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
			autoplay?: boolean | undefined;
			controls?: boolean | undefined;
			crossorigin?: HTMLCrossorigin | undefined;
			loop?: boolean | undefined;
			mediagroup?: string | undefined;
			muted?: boolean | undefined;
			preload?: 'none' | 'metadata' | 'auto' | '' | undefined;
			src?: string | undefined;
			crossOrigin?: HTMLCrossorigin | undefined;
			mediaGroup?: string | undefined;
		}

		interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
			label?: string | undefined;
			type?: 'context' | 'toolbar' | undefined;
		}

		interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
			charset?: string | undefined;
			content?: string | undefined;
			'http-equiv'?: string | undefined;
			name?: string | undefined;
			media?: string | undefined;
		}

		interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
			form?: string | undefined;
			high?: number | string | undefined;
			low?: number | string | undefined;
			max?: number | string | undefined;
			min?: number | string | undefined;
			optimum?: number | string | undefined;
			value?: string | string[] | number | undefined;
		}

		interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
			cite?: string | undefined;
		}

		interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
			data?: string | undefined;
			form?: string | undefined;
			height?: number | string | undefined;
			name?: string | undefined;
			type?: string | undefined;
			usemap?: string | undefined;
			width?: number | string | undefined;
			useMap?: string | undefined;
		}

		interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
			reversed?: boolean | undefined;
			start?: number | string | undefined;
			type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
		}

		interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
			disabled?: boolean | undefined;
			label?: string | undefined;
		}

		interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
			disabled?: boolean | undefined;
			label?: string | undefined;
			selected?: boolean | undefined;
			value?: string | string[] | number | undefined;
		}

		interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
			form?: string | undefined;
			for?: string | undefined;
			name?: string | undefined;
		}

		interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
			name?: string | undefined;
			value?: string | string[] | number | undefined;
		}

		interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
			max?: number | string | undefined;
			value?: string | string[] | number | undefined;
		}

		interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
			async?: boolean | undefined;
			charset?: string | undefined;
			crossorigin?: HTMLCrossorigin | undefined;
			defer?: boolean | undefined;
			integrity?: string | undefined;
			nomodule?: boolean | undefined;
			nonce?: string | undefined;
			referrerpolicy?: HTMLReferrerPolicy | undefined;
			src?: string | undefined;
			type?: string | undefined;
			crossOrigin?: HTMLCrossorigin | undefined;
			noModule?: boolean | undefined;
			referrerPolicy?: HTMLReferrerPolicy | undefined;
		}

		interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
			autocomplete?: string | undefined;
			disabled?: boolean | undefined;
			form?: string | undefined;
			multiple?: boolean | undefined;
			name?: string | undefined;
			required?: boolean | undefined;
			size?: number | string | undefined;
			value?: string | string[] | number | undefined;
		}

		interface HTMLSlotElementAttributes<
			T = HTMLSlotElement,
		> extends HTMLAttributes<T> {
			name?: string | undefined;
		}

		interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
			media?: string | undefined;
			sizes?: string | undefined;
			src?: string | undefined;
			srcset?: string | undefined;
			type?: string | undefined;
		}

		interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
			media?: string | undefined;
			nonce?: string | undefined;
			scoped?: boolean | undefined;
			type?: string | undefined;
		}

		interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
			colspan?: number | string | undefined;
			headers?: string | undefined;
			rowspan?: number | string | undefined;
			colSpan?: number | string | undefined;
			rowSpan?: number | string | undefined;
		}

		interface TemplateHTMLAttributes<
			T extends HTMLTemplateElement,
		> extends HTMLAttributes<T> {
			content?: DocumentFragment | undefined;
		}

		interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
			autocomplete?: string | undefined;
			cols?: number | string | undefined;
			dirname?: string | undefined;
			disabled?: boolean | undefined;
			enterkeyhint?:
				| 'enter'
				| 'done'
				| 'go'
				| 'next'
				| 'previous'
				| 'search'
				| 'send'
				| undefined;
			form?: string | undefined;
			maxlength?: number | string | undefined;
			minlength?: number | string | undefined;
			name?: string | undefined;
			placeholder?: string | undefined;
			readonly?: boolean | undefined;
			required?: boolean | undefined;
			rows?: number | string | undefined;
			value?: string | string[] | number | undefined;
			wrap?: 'hard' | 'soft' | 'off' | undefined;
			maxLength?: number | string | undefined;
			minLength?: number | string | undefined;
			readOnly?: boolean | undefined;
		}

		interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
			colspan?: number | string | undefined;
			headers?: string | undefined;
			rowspan?: number | string | undefined;
			colSpan?: number | string | undefined;
			rowSpan?: number | string | undefined;
			scope?: 'col' | 'row' | 'rowgroup' | 'colgroup' | undefined;
		}

		interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
			datetime?: string | undefined;
			dateTime?: string | undefined;
		}

		interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
			default?: boolean | undefined;
			kind?:
				| 'subtitles'
				| 'captions'
				| 'descriptions'
				| 'chapters'
				| 'metadata'
				| undefined;
			label?: string | undefined;
			src?: string | undefined;
			srclang?: string | undefined;
		}

		interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
			height?: number | string | undefined;
			playsinline?: boolean | undefined;
			poster?: string | undefined;
			width?: number | string | undefined;
		}

		type SVGPreserveAspectRatio =
			| 'none'
			| 'xMinYMin'
			| 'xMidYMin'
			| 'xMaxYMin'
			| 'xMinYMid'
			| 'xMidYMid'
			| 'xMaxYMid'
			| 'xMinYMax'
			| 'xMidYMax'
			| 'xMaxYMax'
			| 'xMinYMin meet'
			| 'xMidYMin meet'
			| 'xMaxYMin meet'
			| 'xMinYMid meet'
			| 'xMidYMid meet'
			| 'xMaxYMid meet'
			| 'xMinYMax meet'
			| 'xMidYMax meet'
			| 'xMaxYMax meet'
			| 'xMinYMin slice'
			| 'xMidYMin slice'
			| 'xMaxYMin slice'
			| 'xMinYMid slice'
			| 'xMidYMid slice'
			| 'xMaxYMid slice'
			| 'xMinYMax slice'
			| 'xMidYMax slice'
			| 'xMaxYMax slice';

		type ImagePreserveAspectRatio =
			| SVGPreserveAspectRatio
			| 'defer none'
			| 'defer xMinYMin'
			| 'defer xMidYMin'
			| 'defer xMaxYMin'
			| 'defer xMinYMid'
			| 'defer xMidYMid'
			| 'defer xMaxYMid'
			| 'defer xMinYMax'
			| 'defer xMidYMax'
			| 'defer xMaxYMax'
			| 'defer xMinYMin meet'
			| 'defer xMidYMin meet'
			| 'defer xMaxYMin meet'
			| 'defer xMinYMid meet'
			| 'defer xMidYMid meet'
			| 'defer xMaxYMid meet'
			| 'defer xMinYMax meet'
			| 'defer xMidYMax meet'
			| 'defer xMaxYMax meet'
			| 'defer xMinYMin slice'
			| 'defer xMidYMin slice'
			| 'defer xMaxYMin slice'
			| 'defer xMinYMid slice'
			| 'defer xMidYMid slice'
			| 'defer xMaxYMid slice'
			| 'defer xMinYMax slice'
			| 'defer xMidYMax slice'
			| 'defer xMaxYMax slice';

		type SVGUnits = 'userSpaceOnUse' | 'objectBoundingBox';

		interface CoreSVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
			id?: string | undefined;
			lang?: string | undefined;
			tabIndex?: number | string | undefined;
			tabindex?: number | string | undefined;
		}

		interface StylableSVGAttributes {
			class?: string | undefined;
			style?: CSSProperties | string | undefined;
		}

		interface TransformableSVGAttributes {
			transform?: string | undefined;
		}

		interface ConditionalProcessingSVGAttributes {
			requiredExtensions?: string | undefined;
			requiredFeatures?: string | undefined;
			systemLanguage?: string | undefined;
		}

		interface ExternalResourceSVGAttributes {
			externalResourcesRequired?: 'true' | 'false' | undefined;
		}

		interface AnimationTimingSVGAttributes {
			begin?: string | undefined;
			dur?: string | undefined;
			end?: string | undefined;
			min?: string | undefined;
			max?: string | undefined;
			restart?: 'always' | 'whenNotActive' | 'never' | undefined;
			repeatCount?: number | 'indefinite' | undefined;
			repeatDur?: string | undefined;
			fill?: 'freeze' | 'remove' | undefined;
		}

		interface AnimationValueSVGAttributes {
			calcMode?: 'discrete' | 'linear' | 'paced' | 'spline' | undefined;
			values?: string | undefined;
			keyTimes?: string | undefined;
			keySplines?: string | undefined;
			from?: number | string | undefined;
			to?: number | string | undefined;
			by?: number | string | undefined;
		}

		interface AnimationAdditionSVGAttributes {
			attributeName?: string | undefined;
			additive?: 'replace' | 'sum' | undefined;
			accumulate?: 'none' | 'sum' | undefined;
		}

		interface AnimationAttributeTargetSVGAttributes {
			attributeName?: string | undefined;
			attributeType?: 'CSS' | 'XML' | 'auto' | undefined;
		}

		interface PresentationSVGAttributes {
			'alignment-baseline'?:
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift'?: number | string | undefined;
			clip?: string | undefined;
			'clip-path'?: string | undefined;
			'clip-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
			color?: string | undefined;
			'color-interpolation'?:
				| 'auto'
				| 'sRGB'
				| 'linearRGB'
				| 'inherit'
				| undefined;
			'color-interpolation-filters'?:
				| 'auto'
				| 'sRGB'
				| 'linearRGB'
				| 'inherit'
				| undefined;
			'color-profile'?: string | undefined;
			'color-rendering'?:
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit'
				| undefined;
			cursor?: string | undefined;
			direction?: 'ltr' | 'rtl' | 'inherit' | undefined;
			display?: string | undefined;
			'dominant-baseline'?:
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background'?: string | undefined;
			fill?: string | undefined;
			'fill-opacity'?: number | string | 'inherit' | undefined;
			'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
			filter?: string | undefined;
			'flood-color'?: string | undefined;
			'flood-opacity'?: number | string | 'inherit' | undefined;
			'font-family'?: string | undefined;
			'font-size'?: string | undefined;
			'font-size-adjust'?: number | string | undefined;
			'font-stretch'?: string | undefined;
			'font-style'?: 'normal' | 'italic' | 'oblique' | 'inherit' | undefined;
			'font-variant'?: string | undefined;
			'font-weight'?: number | string | undefined;
			'glyph-orientation-horizontal'?: string | undefined;
			'glyph-orientation-vertical'?: string | undefined;
			'image-rendering'?:
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit'
				| undefined;
			kerning?: string | undefined;
			'letter-spacing'?: number | string | undefined;
			'lighting-color'?: string | undefined;
			'marker-end'?: string | undefined;
			'marker-mid'?: string | undefined;
			'marker-start'?: string | undefined;
			mask?: string | undefined;
			opacity?: number | string | 'inherit' | undefined;
			overflow?:
				| 'visible'
				| 'hidden'
				| 'scroll'
				| 'auto'
				| 'inherit'
				| undefined;
			pathLength?: string | number | undefined;
			'pointer-events'?:
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			'shape-rendering'?:
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit'
				| undefined;
			'stop-color'?: string | undefined;
			'stop-opacity'?: number | string | 'inherit' | undefined;
			stroke?: string | undefined;
			'stroke-dasharray'?: string | undefined;
			'stroke-dashoffset'?: number | string | undefined;
			'stroke-linecap'?: 'butt' | 'round' | 'square' | 'inherit' | undefined;
			'stroke-linejoin'?:
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit'
				| undefined;
			'stroke-miterlimit'?: number | string | 'inherit' | undefined;
			'stroke-opacity'?: number | string | 'inherit' | undefined;
			'stroke-width'?: number | string | undefined;
			'text-anchor'?: 'start' | 'middle' | 'end' | 'inherit' | undefined;
			'text-decoration'?:
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit'
				| undefined;
			'text-rendering'?:
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi'?: string | undefined;
			visibility?: 'visible' | 'hidden' | 'collapse' | 'inherit' | undefined;
			'word-spacing'?: number | string | undefined;
			'writing-mode'?:
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit'
				| undefined;
		}

		interface AnimationElementSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				ExternalResourceSVGAttributes,
				ConditionalProcessingSVGAttributes {}

		interface ContainerElementSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				ShapeElementSVGAttributes<T>,
				Pick<
					PresentationSVGAttributes,
					| 'clip-path'
					| 'mask'
					| 'cursor'
					| 'opacity'
					| 'filter'
					| 'enable-background'
					| 'color-interpolation'
					| 'color-rendering'
				> {}

		interface FilterPrimitiveElementSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				Pick<PresentationSVGAttributes, 'color-interpolation-filters'> {
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
			result?: string | undefined;
		}

		interface SingleInputFilterSVGAttributes {
			in?: string | undefined;
		}

		interface DoubleInputFilterSVGAttributes {
			in?: string | undefined;
			in2?: string | undefined;
		}

		interface FitToViewBoxSVGAttributes {
			viewBox?: string | undefined;
			preserveAspectRatio?: SVGPreserveAspectRatio | undefined;
		}

		interface GradientElementSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes {
			gradientUnits?: SVGUnits | undefined;
			gradientTransform?: string | undefined;
			spreadMethod?: 'pad' | 'reflect' | 'repeat' | undefined;
			href?: string | undefined;
		}

		interface GraphicsElementSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				Pick<
					PresentationSVGAttributes,
					| 'clip-rule'
					| 'mask'
					| 'pointer-events'
					| 'cursor'
					| 'opacity'
					| 'filter'
					| 'display'
					| 'visibility'
					| 'color-interpolation'
					| 'color-rendering'
				> {}

		interface LightSourceElementSVGAttributes<T> extends CoreSVGAttributes<T> {}

		interface NewViewportSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				Pick<PresentationSVGAttributes, 'overflow' | 'clip'> {
			viewBox?: string | undefined;
		}

		interface ShapeElementSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				Pick<
					PresentationSVGAttributes,
					| 'color'
					| 'fill'
					| 'fill-rule'
					| 'fill-opacity'
					| 'stroke'
					| 'stroke-width'
					| 'stroke-linecap'
					| 'stroke-linejoin'
					| 'stroke-miterlimit'
					| 'stroke-dasharray'
					| 'stroke-dashoffset'
					| 'stroke-opacity'
					| 'shape-rendering'
					| 'pathLength'
				> {}

		interface TextContentElementSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				Pick<
					PresentationSVGAttributes,
					| 'font-family'
					| 'font-style'
					| 'font-variant'
					| 'font-weight'
					| 'font-stretch'
					| 'font-size'
					| 'font-size-adjust'
					| 'kerning'
					| 'letter-spacing'
					| 'word-spacing'
					| 'text-decoration'
					| 'glyph-orientation-horizontal'
					| 'glyph-orientation-vertical'
					| 'direction'
					| 'unicode-bidi'
					| 'text-anchor'
					| 'dominant-baseline'
					| 'color'
					| 'fill'
					| 'fill-rule'
					| 'fill-opacity'
					| 'stroke'
					| 'stroke-width'
					| 'stroke-linecap'
					| 'stroke-linejoin'
					| 'stroke-miterlimit'
					| 'stroke-dasharray'
					| 'stroke-dashoffset'
					| 'stroke-opacity'
				> {}

		interface ZoomAndPanSVGAttributes {
			zoomAndPan?: 'disable' | 'magnify' | undefined;
		}

		interface AnimateSVGAttributes<T>
			extends
				AnimationElementSVGAttributes<T>,
				AnimationAttributeTargetSVGAttributes,
				AnimationTimingSVGAttributes,
				AnimationValueSVGAttributes,
				AnimationAdditionSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'color-interpolation' | 'color-rendering'
				> {}

		interface AnimateMotionSVGAttributes<T>
			extends
				AnimationElementSVGAttributes<T>,
				AnimationTimingSVGAttributes,
				AnimationValueSVGAttributes,
				AnimationAdditionSVGAttributes {
			path?: string | undefined;
			keyPoints?: string | undefined;
			rotate?: number | string | 'auto' | 'auto-reverse' | undefined;
			origin?: 'default' | undefined;
		}

		interface AnimateTransformSVGAttributes<T>
			extends
				AnimationElementSVGAttributes<T>,
				AnimationAttributeTargetSVGAttributes,
				AnimationTimingSVGAttributes,
				AnimationValueSVGAttributes,
				AnimationAdditionSVGAttributes {
			type?: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY' | undefined;
		}

		interface CircleSVGAttributes<T>
			extends
				GraphicsElementSVGAttributes<T>,
				ShapeElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes {
			cx?: number | string | undefined;
			cy?: number | string | undefined;
			r?: number | string | undefined;
		}

		interface ClipPathSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<PresentationSVGAttributes, 'clip-path'> {
			clipPathUnits?: SVGUnits | undefined;
		}

		interface DefsSVGAttributes<T>
			extends
				ContainerElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes {}

		interface DescSVGAttributes<T>
			extends CoreSVGAttributes<T>, StylableSVGAttributes {}

		interface EllipseSVGAttributes<T>
			extends
				GraphicsElementSVGAttributes<T>,
				ShapeElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes {
			cx?: number | string | undefined;
			cy?: number | string | undefined;
			rx?: number | string | undefined;
			ry?: number | string | undefined;
		}

		interface FeBlendSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				DoubleInputFilterSVGAttributes,
				StylableSVGAttributes {
			mode?:
				| 'normal'
				| 'multiply'
				| 'screen'
				| 'darken'
				| 'lighten'
				| undefined;
		}

		interface FeColorMatrixSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes {
			type?:
				| 'matrix'
				| 'saturate'
				| 'hueRotate'
				| 'luminanceToAlpha'
				| undefined;
			values?: string | undefined;
		}

		interface FeComponentTransferSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes {}

		interface FeCompositeSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				DoubleInputFilterSVGAttributes,
				StylableSVGAttributes {
			operator?:
				| 'over'
				| 'in'
				| 'out'
				| 'atop'
				| 'xor'
				| 'arithmetic'
				| undefined;
			k1?: number | string | undefined;
			k2?: number | string | undefined;
			k3?: number | string | undefined;
			k4?: number | string | undefined;
		}

		interface FeConvolveMatrixSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes {
			order?: number | string | undefined;
			kernelMatrix?: string | undefined;
			divisor?: number | string | undefined;
			bias?: number | string | undefined;
			targetX?: number | string | undefined;
			targetY?: number | string | undefined;
			edgeMode?: 'duplicate' | 'wrap' | 'none' | undefined;
			kernelUnitLength?: number | string | undefined;
			preserveAlpha?: 'true' | 'false' | undefined;
		}

		interface FeDiffuseLightingSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes,
				Pick<PresentationSVGAttributes, 'color' | 'lighting-color'> {
			surfaceScale?: number | string | undefined;
			diffuseConstant?: number | string | undefined;
			kernelUnitLength?: number | string | undefined;
		}

		interface FeDisplacementMapSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				DoubleInputFilterSVGAttributes,
				StylableSVGAttributes {
			scale?: number | string | undefined;
			xChannelSelector?: 'R' | 'G' | 'B' | 'A' | undefined;
			yChannelSelector?: 'R' | 'G' | 'B' | 'A' | undefined;
		}

		interface FeDistantLightSVGAttributes<
			T,
		> extends LightSourceElementSVGAttributes<T> {
			azimuth?: number | string | undefined;
			elevation?: number | string | undefined;
		}

		interface FeDropShadowSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				FilterPrimitiveElementSVGAttributes<T>,
				StylableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'color' | 'flood-color' | 'flood-opacity'
				> {
			dx?: number | string | undefined;
			dy?: number | string | undefined;
			stdDeviation?: number | string | undefined;
		}

		interface FeFloodSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				StylableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'color' | 'flood-color' | 'flood-opacity'
				> {}

		interface FeFuncSVGAttributes<T> extends CoreSVGAttributes<T> {
			type?: 'identity' | 'table' | 'discrete' | 'linear' | 'gamma' | undefined;
			tableValues?: string | undefined;
			slope?: number | string | undefined;
			intercept?: number | string | undefined;
			amplitude?: number | string | undefined;
			exponent?: number | string | undefined;
			offset?: number | string | undefined;
		}

		interface FeGaussianBlurSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes {
			stdDeviation?: number | string | undefined;
		}

		interface FeImageSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes {
			preserveAspectRatio?: SVGPreserveAspectRatio | undefined;
			href?: string | undefined;
		}

		interface FeMergeSVGAttributes<T>
			extends FilterPrimitiveElementSVGAttributes<T>, StylableSVGAttributes {}

		interface FeMergeNodeSVGAttributes<T>
			extends CoreSVGAttributes<T>, SingleInputFilterSVGAttributes {}

		interface FeMorphologySVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes {
			operator?: 'erode' | 'dilate' | undefined;
			radius?: number | string | undefined;
		}

		interface FeOffsetSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes {
			dx?: number | string | undefined;
			dy?: number | string | undefined;
		}

		interface FePointLightSVGAttributes<
			T,
		> extends LightSourceElementSVGAttributes<T> {
			x?: number | string | undefined;
			y?: number | string | undefined;
			z?: number | string | undefined;
		}

		interface FeSpecularLightingSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes,
				Pick<PresentationSVGAttributes, 'color' | 'lighting-color'> {
			surfaceScale?: string | undefined;
			specularConstant?: string | undefined;
			specularExponent?: string | undefined;
			kernelUnitLength?: number | string | undefined;
		}

		interface FeSpotLightSVGAttributes<
			T,
		> extends LightSourceElementSVGAttributes<T> {
			x?: number | string | undefined;
			y?: number | string | undefined;
			z?: number | string | undefined;
			pointsAtX?: number | string | undefined;
			pointsAtY?: number | string | undefined;
			pointsAtZ?: number | string | undefined;
			specularExponent?: number | string | undefined;
			limitingConeAngle?: number | string | undefined;
		}

		interface FeTileSVGAttributes<T>
			extends
				FilterPrimitiveElementSVGAttributes<T>,
				SingleInputFilterSVGAttributes,
				StylableSVGAttributes {}

		interface FeTurbulanceSVGAttributes<T>
			extends FilterPrimitiveElementSVGAttributes<T>, StylableSVGAttributes {
			baseFrequency?: number | string | undefined;
			numOctaves?: number | string | undefined;
			seed?: number | string | undefined;
			stitchTiles?: 'stitch' | 'noStitch' | undefined;
			type?: 'fractalNoise' | 'turbulence' | undefined;
		}

		interface FilterSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes {
			filterUnits?: SVGUnits | undefined;
			primitiveUnits?: SVGUnits | undefined;
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
			filterRes?: number | string | undefined;
		}

		interface ForeignObjectSVGAttributes<T>
			extends
				NewViewportSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<PresentationSVGAttributes, 'display' | 'visibility'> {
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
		}

		interface GSVGAttributes<T>
			extends
				ContainerElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<PresentationSVGAttributes, 'display' | 'visibility'> {}

		interface ImageSVGAttributes<T>
			extends
				NewViewportSVGAttributes<T>,
				GraphicsElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<PresentationSVGAttributes, 'color-profile' | 'image-rendering'> {
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
			preserveAspectRatio?: ImagePreserveAspectRatio | undefined;
			href?: string | undefined;
		}

		interface LineSVGAttributes<T>
			extends
				GraphicsElementSVGAttributes<T>,
				ShapeElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'marker-start' | 'marker-mid' | 'marker-end'
				> {
			x1?: number | string | undefined;
			y1?: number | string | undefined;
			x2?: number | string | undefined;
			y2?: number | string | undefined;
		}

		interface LinearGradientSVGAttributes<
			T,
		> extends GradientElementSVGAttributes<T> {
			x1?: number | string | undefined;
			x2?: number | string | undefined;
			y1?: number | string | undefined;
			y2?: number | string | undefined;
		}

		interface MarkerSVGAttributes<T>
			extends
				ContainerElementSVGAttributes<T>,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				FitToViewBoxSVGAttributes,
				Pick<PresentationSVGAttributes, 'overflow' | 'clip'> {
			markerUnits?: 'strokeWidth' | 'userSpaceOnUse' | undefined;
			refX?: number | string | undefined;
			refY?: number | string | undefined;
			markerWidth?: number | string | undefined;
			markerHeight?: number | string | undefined;
			orient?: string | undefined;
		}

		interface MaskSVGAttributes<T>
			extends
				Omit<ContainerElementSVGAttributes<T>, 'opacity' | 'filter'>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes {
			maskUnits?: SVGUnits | undefined;
			maskContentUnits?: SVGUnits | undefined;
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
		}

		interface MetadataSVGAttributes<T> extends CoreSVGAttributes<T> {}

		interface MPathSVGAttributes<T> extends CoreSVGAttributes<T> {}

		interface PathSVGAttributes<T>
			extends
				GraphicsElementSVGAttributes<T>,
				ShapeElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'marker-start' | 'marker-mid' | 'marker-end'
				> {
			d?: string | undefined;
			pathLength?: number | string | undefined;
		}

		interface PatternSVGAttributes<T>
			extends
				ContainerElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				FitToViewBoxSVGAttributes,
				Pick<PresentationSVGAttributes, 'overflow' | 'clip'> {
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
			patternUnits?: SVGUnits | undefined;
			patternContentUnits?: SVGUnits | undefined;
			patternTransform?: string | undefined;
			href?: string | undefined;
		}

		interface PolygonSVGAttributes<T>
			extends
				GraphicsElementSVGAttributes<T>,
				ShapeElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'marker-start' | 'marker-mid' | 'marker-end'
				> {
			points?: string | undefined;
		}

		interface PolylineSVGAttributes<T>
			extends
				GraphicsElementSVGAttributes<T>,
				ShapeElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'marker-start' | 'marker-mid' | 'marker-end'
				> {
			points?: string | undefined;
		}

		interface RadialGradientSVGAttributes<
			T,
		> extends GradientElementSVGAttributes<T> {
			cx?: number | string | undefined;
			cy?: number | string | undefined;
			r?: number | string | undefined;
			fx?: number | string | undefined;
			fy?: number | string | undefined;
		}

		interface RectSVGAttributes<T>
			extends
				GraphicsElementSVGAttributes<T>,
				ShapeElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes {
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
			rx?: number | string | undefined;
			ry?: number | string | undefined;
		}

		interface SetSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				StylableSVGAttributes,
				AnimationTimingSVGAttributes {}

		interface StopSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				StylableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'color' | 'stop-color' | 'stop-opacity'
				> {
			offset?: number | string | undefined;
		}

		interface SvgSVGAttributes<T>
			extends
				ContainerElementSVGAttributes<T>,
				NewViewportSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				FitToViewBoxSVGAttributes,
				ZoomAndPanSVGAttributes,
				PresentationSVGAttributes {
			version?: string | undefined;
			baseProfile?: string | undefined;
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
			contentScriptType?: string | undefined;
			contentStyleType?: string | undefined;
			xmlns?: string | undefined;
			'xmlns:xlink'?: string | undefined;
		}

		interface SwitchSVGAttributes<T>
			extends
				ContainerElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<PresentationSVGAttributes, 'display' | 'visibility'> {}

		interface SymbolSVGAttributes<T>
			extends
				ContainerElementSVGAttributes<T>,
				NewViewportSVGAttributes<T>,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				FitToViewBoxSVGAttributes {
			width?: number | string | undefined;
			height?: number | string | undefined;
			preserveAspectRatio?: SVGPreserveAspectRatio | undefined;
			refX?: number | string | undefined;
			refY?: number | string | undefined;
			viewBox?: string | undefined;
			x?: number | string | undefined;
			y?: number | string | undefined;
		}

		interface TextSVGAttributes<T>
			extends
				TextContentElementSVGAttributes<T>,
				GraphicsElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				TransformableSVGAttributes,
				Pick<PresentationSVGAttributes, 'writing-mode' | 'text-rendering'> {
			x?: number | string | undefined;
			y?: number | string | undefined;
			dx?: number | string | undefined;
			dy?: number | string | undefined;
			rotate?: number | string | undefined;
			textLength?: number | string | undefined;
			lengthAdjust?: 'spacing' | 'spacingAndGlyphs' | undefined;
		}

		interface TextPathSVGAttributes<T>
			extends
				TextContentElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'alignment-baseline' | 'baseline-shift' | 'display' | 'visibility'
				> {
			startOffset?: number | string | undefined;
			method?: 'align' | 'stretch' | undefined;
			spacing?: 'auto' | 'exact' | undefined;
			href?: string | undefined;
		}

		interface TSpanSVGAttributes<T>
			extends
				TextContentElementSVGAttributes<T>,
				ConditionalProcessingSVGAttributes,
				ExternalResourceSVGAttributes,
				StylableSVGAttributes,
				Pick<
					PresentationSVGAttributes,
					'alignment-baseline' | 'baseline-shift' | 'display' | 'visibility'
				> {
			x?: number | string | undefined;
			y?: number | string | undefined;
			dx?: number | string | undefined;
			dy?: number | string | undefined;
			rotate?: number | string | undefined;
			textLength?: number | string | undefined;
			lengthAdjust?: 'spacing' | 'spacingAndGlyphs' | undefined;
		}

		/**
		 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use
		 */
		interface UseSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				StylableSVGAttributes,
				ConditionalProcessingSVGAttributes,
				GraphicsElementSVGAttributes<T>,
				PresentationSVGAttributes,
				ExternalResourceSVGAttributes,
				TransformableSVGAttributes {
			x?: number | string | undefined;
			y?: number | string | undefined;
			width?: number | string | undefined;
			height?: number | string | undefined;
			href?: string | undefined;
		}

		interface ViewSVGAttributes<T>
			extends
				CoreSVGAttributes<T>,
				ExternalResourceSVGAttributes,
				FitToViewBoxSVGAttributes,
				ZoomAndPanSVGAttributes {
			viewTarget?: string | undefined;
		}

		/**
		 * @type {HTMLElementTagNameMap}
		 */
		interface HTMLElementTags {
			/**
			 * The anchor element (`<a>`) creates a hyperlink to other web pages, files, locations
			 * within the same page, email addresses, or any other URL.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/a)
			 */
			a: AnchorHTMLAttributes<HTMLAnchorElement>;

			/**
			 * The abbreviation element (`<abbr>`) represents an abbreviation or acronym.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/abbr)
			 */
			abbr: HTMLAttributes<HTMLElement>;

			/**
			 * The `<address>` element indicates that the enclosed HTML provides contact information
			 * for a person or organization.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/address)
			 */
			address: HTMLAttributes<HTMLElement>;

			/**
			 * The `<area>` element defines an area inside an image map that has predefined clickable areas.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/area)
			 */
			area: AreaHTMLAttributes<HTMLAreaElement>;

			/**
			 * The `<article>` element represents a self-contained composition in a document, page,
			 * application, or site, which is intended to be independently distributable or reusable.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/article)
			 */
			article: HTMLAttributes<HTMLElement>;

			/**
			 * The `<aside>` element represents a portion of a document whose content is only indirectly
			 * related to the document's main content.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/aside)
			 */
			aside: HTMLAttributes<HTMLElement>;

			/**
			 * The `<audio>` element is used to embed sound content in documents.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/audio)
			 */
			audio: AudioHTMLAttributes<HTMLAudioElement>;

			/**
			 * The `<b>` element represents text that should be stylistically different from normal text,
			 * without conveying extra importance.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/b)
			 */
			b: HTMLAttributes<HTMLElement>;

			/**
			 * The `<base>` element specifies the base URL to use for all relative URLs in a document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/base)
			 */
			base: BaseHTMLAttributes<HTMLBaseElement>;

			/**
			 * The `<bdi>` element tells the browser's bidirectional algorithm to treat the text it
			 * contains in isolation from its surrounding text.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/bdi)
			 */
			bdi: HTMLAttributes<HTMLElement>;

			/**
			 * The `<bdo>` element overrides the current directionality of text.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/bdo)
			 */
			bdo: HTMLAttributes<HTMLElement>;

			/**
			 * The `<blockquote>` element indicates that the enclosed text is an extended quotation.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/blockquote)
			 */
			blockquote: BlockquoteHTMLAttributes<HTMLElement>;

			/**
			 * The `<body>` element represents the content of an HTML document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/body)
			 */
			body: HTMLAttributes<HTMLBodyElement>;

			/**
			 * The `<br>` element produces a line break in text.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/br)
			 */
			br: HTMLAttributes<HTMLBRElement>;

			/**
			 * The `<button>` element represents a clickable button.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/button)
			 */
			button: ButtonHTMLAttributes<HTMLButtonElement>;

			/**
			 * The `<canvas>` element can be used to draw graphics via JavaScript.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/canvas)
			 */
			canvas: CanvasHTMLAttributes<HTMLCanvasElement>;

			/**
			 * The `<caption>` element specifies the caption (or title) of a table.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/caption)
			 */
			caption: HTMLAttributes<HTMLElement>;

			/**
			 * The `<cite>` element represents a reference to a creative work.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/cite)
			 */
			cite: HTMLAttributes<HTMLElement>;

			/**
			 * The `<code>` element displays its contents styled in a fashion intended to indicate
			 * that the text is a short fragment of computer code.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/code)
			 */
			code: HTMLAttributes<HTMLElement>;

			/**
			 * The `<col>` element defines a column within a table.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/col)
			 */
			col: ColHTMLAttributes<HTMLTableColElement>;

			/**
			 * The `<colgroup>` element defines a group of columns within a table.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/colgroup)
			 */
			colgroup: ColgroupHTMLAttributes<HTMLTableColElement>;

			/**
			 * The `<data>` element links a given piece of content with a machine-readable translation.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/data)
			 */
			data: DataHTMLAttributes<HTMLElement>;

			/**
			 * The `<datalist>` element contains a set of `<option>` elements that represent the permissible
			 * or recommended options available to choose from within other controls.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/datalist)
			 */
			datalist: HTMLAttributes<HTMLDataListElement>;

			/**
			 * The `<dd>` element provides the description, definition, or value for the preceding term
			 * in a description list.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/dd)
			 */
			dd: HTMLAttributes<HTMLElement>;

			/**
			 * The `<del>` element represents a range of text that has been deleted from a document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/del)
			 */
			del: HTMLAttributes<HTMLElement>;

			/**
			 * The `<details>` element creates a disclosure widget in which information is visible only
			 * when the widget is toggled into an "open" state.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/details)
			 */
			details: DetailsHtmlAttributes<HTMLDetailsElement>;

			/**
			 * The `<dfn>` element represents a term being defined within the context of a definition phrase or sentence.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/dfn)
			 */
			dfn: HTMLAttributes<HTMLElement>;

			/**
			 * The `<dialog>` element represents a dialog box or other interactive component.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/dialog)
			 */
			dialog: DialogHtmlAttributes<HTMLDialogElement>;

			/**
			 * The `<div>` element is the generic container for flow content.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/div)
			 */
			div: HTMLAttributes<HTMLDivElement>;

			/**
			 * The `<dl>` element represents a description list.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/dl)
			 */
			dl: HTMLAttributes<HTMLDListElement>;

			/**
			 * The `<dt>` element specifies a term in a description or definition list.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/dt)
			 */
			dt: HTMLAttributes<HTMLElement>;

			/**
			 * The `<em>` element marks text that has stress emphasis.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/em)
			 */
			em: HTMLAttributes<HTMLElement>;

			/**
			 * The `<embed>` element embeds external content at the specified point in the document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/embed)
			 */
			embed: EmbedHTMLAttributes<HTMLEmbedElement>;

			/**
			 * The `<fieldset>` element is used to group several controls as well as labels within a web form.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/fieldset)
			 */
			fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>;

			/**
			 * The `<figcaption>` element represents a caption or legend describing the rest of the
			 * contents of its parent `<figure>` element.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/figcaption)
			 */
			figcaption: HTMLAttributes<HTMLElement>;

			/**
			 * The `<figure>` element represents self-contained content, potentially with an optional caption.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/figure)
			 */
			figure: HTMLAttributes<HTMLElement>;

			/**
			 * The `<footer>` element represents a footer for its nearest sectioning content or
			 * sectioning root element.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/footer)
			 */
			footer: HTMLAttributes<HTMLElement>;

			/**
			 * The `<form>` element represents a document section containing interactive controls
			 * for submitting information.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/form)
			 */
			form: FormHTMLAttributes<HTMLFormElement>;

			/**
			 * The `<h1>` to `<h6>` elements represent six levels of section headings.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements)
			 */
			h1: HTMLAttributes<HTMLHeadingElement>;
			/**
			 * The `<h1>` to `<h6>` elements represent six levels of section headings.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements)
			 */
			h2: HTMLAttributes<HTMLHeadingElement>;
			/**
			 * The `<h1>` to `<h6>` elements represent six levels of section headings.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements)
			 */
			h3: HTMLAttributes<HTMLHeadingElement>;
			/**
			 * The `<h1>` to `<h6>` elements represent six levels of section headings.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements)
			 */
			h4: HTMLAttributes<HTMLHeadingElement>;
			/**
			 * The `<h1>` to `<h6>` elements represent six levels of section headings.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements)
			 */
			h5: HTMLAttributes<HTMLHeadingElement>;
			/**
			 * The `<h1>` to `<h6>` elements represent six levels of section headings.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements)
			 */
			h6: HTMLAttributes<HTMLHeadingElement>;

			/**
			 * The `<head>` element contains machine-readable information (metadata) about the document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/head)
			 */
			head: HTMLAttributes<HTMLHeadElement>;

			/**
			 * The `<header>` element represents introductory content, typically a group of introductory
			 * or navigational aids.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/header)
			 */
			header: HTMLAttributes<HTMLElement>;

			/**
			 * The `<hgroup>` element represents a multi-level heading for a section of a document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/hgroup)
			 */
			hgroup: HTMLAttributes<HTMLElement>;

			/**
			 * The `<hr>` element represents a thematic break between paragraph-level elements.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/hr)
			 */
			hr: HTMLAttributes<HTMLHRElement>;

			/**
			 * The `<html>` element represents the root (top-level element) of an HTML document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/html)
			 */
			html: HTMLAttributes<HTMLHtmlElement>;

			/**
			 * The `<i>` element represents text that is set off from the normal text for some reason,
			 * such as idiomatic text, technical terms, taxonomical designations.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/i)
			 */
			i: HTMLAttributes<HTMLElement>;

			/**
			 * The `<iframe>` element represents a nested browsing context.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/iframe)
			 */
			iframe: IframeHTMLAttributes<HTMLIFrameElement>;

			/**
			 * The `<img>` element embeds an image into the document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/img)
			 */
			img: ImgHTMLAttributes<HTMLImageElement>;

			/**
			 * The `<input>` element is used to create interactive controls for web-based forms.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/input)
			 */
			input: InputHTMLAttributes<HTMLInputElement>;

			/**
			 * The `<ins>` element represents a range of text that has been added to a document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/ins)
			 */
			ins: InsHTMLAttributes<HTMLModElement>;

			/**
			 * The `<kbd>` element represents a span of inline text denoting textual user input
			 * from a keyboard, voice input, or any other text entry device.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/kbd)
			 */
			kbd: HTMLAttributes<HTMLElement>;

			/**
			 * The `<label>` element represents a caption for an item in a user interface.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/label)
			 */
			label: LabelHTMLAttributes<HTMLLabelElement>;

			/**
			 * The `<legend>` element represents a caption for the content of its parent `<fieldset>`.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/legend)
			 */
			legend: HTMLAttributes<HTMLLegendElement>;

			/**
			 * The `<li>` element represents an item in a list.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/li)
			 */
			li: LiHTMLAttributes<HTMLLIElement>;

			/**
			 * The `<link>` element specifies relationships between the current document and an external resource.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/link)
			 */
			link: LinkHTMLAttributes<HTMLLinkElement>;

			/**
			 * The `<main>` element represents the dominant content of the document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/main)
			 */
			main: HTMLAttributes<HTMLElement>;

			/**
			 * The `<map>` element is used with `<area>` elements to define an image map.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/map)
			 */
			map: MapHTMLAttributes<HTMLMapElement>;

			/**
			 * The `<mark>` element represents text which is marked or highlighted for reference or notation purposes.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/mark)
			 */
			mark: HTMLAttributes<HTMLElement>;

			/**
			 * The `<menu>` element represents a group of commands that a user can perform or activate.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/menu)
			 */
			menu: MenuHTMLAttributes<HTMLElement>;

			/**
			 * The `<meta>` element represents metadata that cannot be represented by other HTML meta-related elements.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/meta)
			 */
			meta: MetaHTMLAttributes<HTMLMetaElement>;

			/**
			 * The `<meter>` element represents a scalar measurement within a known range, or a fractional value.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/meter)
			 */
			meter: MeterHTMLAttributes<HTMLElement>;

			/**
			 * The `<nav>` element represents a section of a page whose purpose is to provide navigation links.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/nav)
			 */
			nav: HTMLAttributes<HTMLElement>;

			/**
			 * The `<noscript>` element defines alternative content to be displayed when the browser doesn't support scripting.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/noscript)
			 */
			noscript: HTMLAttributes<HTMLElement>;

			/**
			 * The `<object>` element represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/object)
			 */
			object: ObjectHTMLAttributes<HTMLObjectElement>;

			/**
			 * The `<ol>` element represents an ordered list of items.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/ol)
			 */
			ol: OlHTMLAttributes<HTMLOListElement>;

			/**
			 * The `<optgroup>` element creates a grouping of options within a `<select>` element.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/optgroup)
			 */
			optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>;

			/**
			 * The `<option>` element is used to define an item contained in a select, an optgroup, or a datalist element.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/option)
			 */
			option: OptionHTMLAttributes<HTMLOptionElement>;

			/**
			 * The `<output>` element represents the result of a calculation or user action.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/output)
			 */
			output: OutputHTMLAttributes<HTMLElement>;

			/**
			 * The `<p>` element represents a paragraph.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/p)
			 */
			p: HTMLAttributes<HTMLParagraphElement>;

			/**
			 * The `<picture>` element contains zero or more `<source>` elements and one `<img>` element to offer alternative versions of an image.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/picture)
			 */
			picture: HTMLAttributes<HTMLElement>;

			/**
			 * The `<pre>` element represents preformatted text which is to be presented exactly as written in the HTML file.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/pre)
			 */
			pre: HTMLAttributes<HTMLPreElement>;

			/**
			 * The `<progress>` element displays an indicator showing the completion progress of a task.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/progress)
			 */
			progress: ProgressHTMLAttributes<HTMLProgressElement>;

			/**
			 * The `<q>` element indicates that the enclosed text is a short inline quotation.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/q)
			 */
			q: QuoteHTMLAttributes<HTMLQuoteElement>;

			/**
			 * The `<rp>` element is used to provide fall-back parentheses for browsers that don't support ruby annotations.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/rp)
			 */
			rp: HTMLAttributes<HTMLElement>;

			/**
			 * The `<rt>` element specifies the ruby text component of a ruby annotation.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/rt)
			 */
			rt: HTMLAttributes<HTMLElement>;

			/**
			 * The `<ruby>` element represents small annotations that are rendered above, below, or next to base text.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/ruby)
			 */
			ruby: HTMLAttributes<HTMLElement>;

			/**
			 * The `<s>` element renders text with a strikethrough, or a line through it.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/s)
			 */
			s: HTMLAttributes<HTMLElement>;

			/**
			 * The `<samp>` element is used to enclose inline text which represents sample (or quoted) output from a computer program.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/samp)
			 */
			samp: HTMLAttributes<HTMLElement>;

			/**
			 * The `<script>` element is used to embed executable code or data; this is typically used to embed or refer to JavaScript code.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/script)
			 */
			script: ScriptHTMLAttributes<HTMLScriptElement>;

			/**
			 * The `<search>` element represents a part of a document or application that contains tools for searching.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/search)
			 */
			search: HTMLAttributes<HTMLElement>;

			/**
			 * The `<section>` element represents a standalone section of functionality contained within an HTML document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/section)
			 */
			section: HTMLAttributes<HTMLElement>;

			/**
			 * The `<select>` element represents a control that provides a menu of options.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/select)
			 */
			select: SelectHTMLAttributes<HTMLSelectElement>;

			/**
			 * The `<slot>` element is a placeholder inside a web component that you can fill with your own markup.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/slot)
			 */
			slot: HTMLSlotElementAttributes;

			/**
			 * The `<small>` element represents side-comments and small print, like copyright and legal text.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/small)
			 */
			small: HTMLAttributes<HTMLElement>;

			/**
			 * The `<source>` element specifies multiple media resources for media elements (`<picture>`, `<audio>` and `<video>`).
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/source)
			 */
			source: SourceHTMLAttributes<HTMLSourceElement>;

			/**
			 * The `<span>` element is a generic inline container for phrasing content.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/span)
			 */
			span: HTMLAttributes<HTMLSpanElement>;

			/**
			 * The `<strong>` element indicates that its contents have strong importance, seriousness, or urgency.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/strong)
			 */
			strong: HTMLAttributes<HTMLElement>;

			/**
			 * The `<style>` element contains style information for a document, or part of a document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/style)
			 */
			style: StyleHTMLAttributes<HTMLStyleElement>;

			/**
			 * The `<sub>` element specifies inline text which should be displayed as subscript.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/sub)
			 */
			sub: HTMLAttributes<HTMLElement>;

			/**
			 * The `<summary>` element specifies a summary, caption, or legend for a `<details>` element's disclosure box.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/summary)
			 */
			summary: HTMLAttributes<HTMLElement>;

			/**
			 * The `<sup>` element specifies inline text which is to be displayed as superscript.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/sup)
			 */
			sup: HTMLAttributes<HTMLElement>;

			/**
			 * The `<table>` element represents tabular data.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/table)
			 */
			table: HTMLAttributes<HTMLTableElement>;

			/**
			 * The `<tbody>` element encapsulates a set of table rows, indicating that they comprise the body of the table.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/tbody)
			 */
			tbody: HTMLAttributes<HTMLTableSectionElement>;

			/**
			 * The `<td>` element defines a cell of a table that contains data.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/td)
			 */
			td: TdHTMLAttributes<HTMLTableCellElement>;

			/**
			 * The `<template>` element is a mechanism for holding HTML that is not to be rendered immediately when a page is loaded.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/template)
			 */
			template: TemplateHTMLAttributes<HTMLTemplateElement>;

			/**
			 * The `<textarea>` element represents a multi-line plain-text editing control.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/textarea)
			 */
			textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;

			/**
			 * The `<tfoot>` element defines a set of rows summarizing the columns of the table.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/tfoot)
			 */
			tfoot: HTMLAttributes<HTMLTableSectionElement>;

			/**
			 * The `<th>` element defines a cell as a header of a group of table cells.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/th)
			 */
			th: ThHTMLAttributes<HTMLTableCellElement>;

			/**
			 * The `<thead>` element defines a set of rows defining the head of the columns of the table.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/thead)
			 */
			thead: HTMLAttributes<HTMLTableSectionElement>;

			/**
			 * The `<time>` element represents a specific period in time.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/time)
			 */
			time: TimeHTMLAttributes<HTMLElement>;

			/**
			 * The `<title>` element defines the document's title that is shown in a browser's title bar or a page's tab.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/title)
			 */
			title: HTMLAttributes<HTMLTitleElement>;

			/**
			 * The `<tr>` element defines a row of cells in a table.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/tr)
			 */
			tr: HTMLAttributes<HTMLTableRowElement>;

			/**
			 * The `<track>` element is used as a child of the media elements, audio and video.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/track)
			 */
			track: TrackHTMLAttributes<HTMLTrackElement>;

			/**
			 * The `<u>` element represents a span of inline text which should be rendered in a way that indicates that it has a non-textual annotation.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/u)
			 */
			u: HTMLAttributes<HTMLElement>;

			/**
			 * The `<ul>` element represents an unordered list of items.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/ul)
			 */
			ul: HTMLAttributes<HTMLUListElement>;

			/**
			 * The `<var>` element represents a variable in a mathematical expression or a programming context.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/var)
			 */
			var: HTMLAttributes<HTMLElement>;

			/**
			 * The `<video>` element embeds a media player which supports video playback into the document.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/video)
			 */
			video: VideoHTMLAttributes<HTMLVideoElement>;

			/**
			 * The `<wbr>` element represents a word break opportunity.
			 * [MDN Reference](https://developer.mozilla.org/docs/Web/HTML/Element/wbr)
			 */
			wbr: HTMLAttributes<HTMLElement>;
		}

		/**
		 * @type {HTMLElementDeprecatedTagNameMap}
		 */
		interface HTMLElementDeprecatedTags {
			/**
			 * The `<big>` HTML element renders the enclosed text at a font size one level larger than the surrounding text.
			 * This element was removed from the HTML specification and shouldn't be used anymore.
			 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/big)
			 * @deprecated This feature is no longer recommended.
			 */
			big: HTMLAttributes<HTMLElement>;

			/**
			 * The `<keygen>` HTML element exists to facilitate generation of key material, and submission of the public key as part of an HTML form.
			 * This element has been removed from the HTML specification.
			 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/keygen)
			 * @deprecated This feature is no longer recommended.
			 */
			keygen: KeygenHTMLAttributes<HTMLElement>;

			/**
			 * The `<menuitem>` HTML element represents a command that a user can invoke through a popup menu.
			 * This element was never standardized and is now obsolete.
			 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menuitem)
			 * @deprecated This feature is no longer recommended.
			 */
			menuitem: HTMLAttributes<HTMLElement>;

			/**
			 * The `<noindex>` HTML element indicates to search engines to not index the content within this container.
			 * This is a non-standard element primarily used by Yandex.
			 * @deprecated This feature is non-standard and is not on a standards track.
			 */
			noindex: HTMLAttributes<HTMLElement>;

			/**
			 * The `<param>` HTML element defines parameters for an `<object>` element.
			 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/param)
			 * @deprecated This feature is no longer recommended.
			 */
			param: ParamHTMLAttributes<HTMLParamElement>;
		}

		/**
		 * @type {SVGElementTagNameMap}
		 *
		 */
		interface SVGElementTags {
			animate: AnimateSVGAttributes<SVGAnimateElement>;
			animateMotion: AnimateMotionSVGAttributes<SVGAnimateMotionElement>;
			animateTransform: AnimateTransformSVGAttributes<SVGAnimateTransformElement>;
			circle: CircleSVGAttributes<SVGCircleElement>;
			clipPath: ClipPathSVGAttributes<SVGClipPathElement>;
			defs: DefsSVGAttributes<SVGDefsElement>;
			desc: DescSVGAttributes<SVGDescElement>;
			ellipse: EllipseSVGAttributes<SVGEllipseElement>;
			feBlend: FeBlendSVGAttributes<SVGFEBlendElement>;
			feColorMatrix: FeColorMatrixSVGAttributes<SVGFEColorMatrixElement>;
			feComponentTransfer: FeComponentTransferSVGAttributes<SVGFEComponentTransferElement>;
			feComposite: FeCompositeSVGAttributes<SVGFECompositeElement>;
			feConvolveMatrix: FeConvolveMatrixSVGAttributes<SVGFEConvolveMatrixElement>;
			feDiffuseLighting: FeDiffuseLightingSVGAttributes<SVGFEDiffuseLightingElement>;
			feDisplacementMap: FeDisplacementMapSVGAttributes<SVGFEDisplacementMapElement>;
			feDistantLight: FeDistantLightSVGAttributes<SVGFEDistantLightElement>;
			feDropShadow: FeDropShadowSVGAttributes<SVGFEDropShadowElement>;
			feFlood: FeFloodSVGAttributes<SVGFEFloodElement>;
			feFuncA: FeFuncSVGAttributes<SVGFEFuncAElement>;
			feFuncB: FeFuncSVGAttributes<SVGFEFuncBElement>;
			feFuncG: FeFuncSVGAttributes<SVGFEFuncGElement>;
			feFuncR: FeFuncSVGAttributes<SVGFEFuncRElement>;
			feGaussianBlur: FeGaussianBlurSVGAttributes<SVGFEGaussianBlurElement>;
			feImage: FeImageSVGAttributes<SVGFEImageElement>;
			feMerge: FeMergeSVGAttributes<SVGFEMergeElement>;
			feMergeNode: FeMergeNodeSVGAttributes<SVGFEMergeNodeElement>;
			feMorphology: FeMorphologySVGAttributes<SVGFEMorphologyElement>;
			feOffset: FeOffsetSVGAttributes<SVGFEOffsetElement>;
			fePointLight: FePointLightSVGAttributes<SVGFEPointLightElement>;
			feSpecularLighting: FeSpecularLightingSVGAttributes<SVGFESpecularLightingElement>;
			feSpotLight: FeSpotLightSVGAttributes<SVGFESpotLightElement>;
			feTile: FeTileSVGAttributes<SVGFETileElement>;
			feTurbulence: FeTurbulanceSVGAttributes<SVGFETurbulenceElement>;
			filter: FilterSVGAttributes<SVGFilterElement>;
			foreignObject: ForeignObjectSVGAttributes<SVGForeignObjectElement>;
			g: GSVGAttributes<SVGGElement>;
			image: ImageSVGAttributes<SVGImageElement>;
			line: LineSVGAttributes<SVGLineElement>;
			linearGradient: LinearGradientSVGAttributes<SVGLinearGradientElement>;
			marker: MarkerSVGAttributes<SVGMarkerElement>;
			mask: MaskSVGAttributes<SVGMaskElement>;
			metadata: MetadataSVGAttributes<SVGMetadataElement>;
			mpath: MPathSVGAttributes<SVGMPathElement>;
			path: PathSVGAttributes<SVGPathElement>;
			pattern: PatternSVGAttributes<SVGPatternElement>;
			polygon: PolygonSVGAttributes<SVGPolygonElement>;
			polyline: PolylineSVGAttributes<SVGPolylineElement>;
			radialGradient: RadialGradientSVGAttributes<SVGRadialGradientElement>;
			rect: RectSVGAttributes<SVGRectElement>;
			set: SetSVGAttributes<SVGSetElement>;
			stop: StopSVGAttributes<SVGStopElement>;
			svg: SvgSVGAttributes<SVGSVGElement>;
			switch: SwitchSVGAttributes<SVGSwitchElement>;
			symbol: SymbolSVGAttributes<SVGSymbolElement>;
			text: TextSVGAttributes<SVGTextElement>;
			textPath: TextPathSVGAttributes<SVGTextPathElement>;
			tspan: TSpanSVGAttributes<SVGTSpanElement>;
			use: UseSVGAttributes<SVGUseElement>;
			view: ViewSVGAttributes<SVGViewElement>;
		}

		type ElementProps<T> = {
			// Add both the element's prefixed properties and the attributes
			[K in keyof T]: PropsWithNamespaces<T[K]> /*  & HTMLAttributes<T[K]> */;
		};
		// Prefixes all properties with `prop:`, etc. to match Solid's property setting syntax
		type PropsWithNamespaces<T> = {
			[K in keyof T as `${'prop:' | 'attr:' | 'bool:' | 'if:' | ''}${string & K}`]?: T[K];
		};
		type CustomElementPropsWithNamespaces<T> = {
			// Add both the element's prefixed properties and the attributes
			[K in keyof T]: PropsWithNamespaces<T[K]> &
				HTMLAttributes<T[K]> & { [key: `on:${string}`]: (event: Event) => any };
		};

		// `children` is a native HTMLElement property, we have to exclude it,
		// for it to not conflict with JSX children.

		type GetCustomElements<T> = {
			[K in keyof T as K extends `${string}-${string}` ? K : never]: T[K];
		};
		type CustomElementsProps = CustomElementPropsWithNamespaces<
			GetCustomElements<HTMLElementTagNameMap>
		>;

		type BuiltInsAndCustomTags =
			//
			ElementProps<HTMLElementTags> /* & CustomElementsProps */;

		// IDEA: Generalize `prop:` binding to real prop.!
		type PropertiesMap<T> = Partial<{
			[K in keyof T as K extends string // Ensure the key is a string
				? K extends Uppercase<string> // Exclude uppercase constants
					? never
					: K extends `${number}` | symbol // Exclude numeric-like and symbol keys
						? never
						: T[K] extends string | number | boolean | null | undefined // Filter valid attribute types
							? `prop:${K}`
							: never
				: never]: T[K];
		}>;

		interface CustomElementFallback {
			[elemName: `${string}-${string}`]: HTMLAttributes<HTMLElement> &
				PropertiesMap<HTMLElement>;
		}

		interface IntrinsicElements
			extends
				BuiltInsAndCustomTags,
				HTMLElementDeprecatedTags,
				SVGElementTags,
				CustomElementFallback {}
	}
}
