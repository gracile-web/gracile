/* eslint-disable @typescript-eslint/no-namespace */
// Hard-copied from web-elements-analyzer (not yet published). Source: dist/core/models/intrinsics/intrinsics.gen.d.ts
import type * as Intrinsics from './_vendor/wea-intrinsics.gen.js';

import * as csstype from 'csstype';

export namespace JSX {
	export type AddPrefixToKeys<
		T extends Record<string, any>,
		Prefix extends string,
	> = {
		[K in keyof T as `${Prefix}${K & string}`]: T[K];
	};
	export type BaseElement = Intrinsics.BaseElement;

	export type BaseHTMLElement = Intrinsics.BaseHTMLElement;

	export type ClassArray = ClassValue[];

	export type ClassDictionary = Record<string, any>;

	export interface ClassInfo {
		readonly [name: string]: boolean | number | string;
	}

	export type ClassValue =
		| bigint
		| boolean
		| ClassArray
		| ClassDictionary
		| null
		| number
		| string
		| undefined;

	export interface CustomSpecialAttributes<
		ElementInterface,
	> extends StandardSpecialAttributes<ElementInterface> {
		'class:list'?: ClassArray | undefined;
		'class:map'?: ClassInfo | undefined;
		'style:map'?: (CssCustomProperty & csstype.Properties) | undefined;
	}

	export interface ElementChildrenAttribute {
		'$:children': TemplateElement;
	}

	export type EventListener<
		ElementInterface extends EventTarget,
		TypedEvent extends Event,
		Function = (event: TargetedEvent<ElementInterface, TypedEvent>) => void,
		Object = { handleEvent: Function },
	> = Function | Object;

	export type EventsPrefixed<
		EventMap extends Record<string, Event>,
		Target extends EventTarget = EventTarget,
		Prefix extends string = '',
	> = {
		[EventName in keyof EventMap as `${Prefix}${EventName & string}`]: EventListener<
			Target,
			EventMap[EventName]
		>;
	};

	export type ExpandCustomElementFacets<
		Facets extends Record<any, any>,
		TagName,
		ElementInterface extends HTMLElement | SVGElement =
			InterfaceFromTsDom<TagName>,
	> = Partial<
		AddPrefixToKeys<Facets['properties'], PrefixProperty> &
			CustomSpecialAttributes<ElementInterface> &
			ElementChildrenAttribute &
			EventsPrefixed<Facets['events'], ElementInterface, PrefixEventListener> &
			Facets['attributes']
	>;

	export interface IntrinsicElements
		extends
			MappedIntrinsicElements<
				Intrinsics.BaseHTMLElements,
				Intrinsics.BaseHTMLElement
			>,
			MappedIntrinsicElements<
				SVGElementsWithoutConflicts,
				Intrinsics.BaseSVGElement
			>,
			SpecialElements {}

	export type Key = bigint | number | string;

	export type MappedCustomElements<
		TagMap extends Record<any, any>,
		Base extends Record<any, any>,
	> = {
		[TagName in keyof TagMap]: ExpandCustomElementFacets<Base, TagName> &
			ExpandCustomElementFacets<BaseElement, TagName> &
			ExpandCustomElementFacets<BaseHTMLElement, TagName> &
			ExpandCustomElementFacets<TagMap[TagName], TagName>;
	};
	export type ReferenceOrCallback<T = TemplateElement> =
		| ((element: T | undefined) => void)
		| Reference<T>;

	// eslint-disable-next-line sonarjs/redundant-type-aliases
	export type TemplateElement = unknown;

	interface CssCustomProperty {
		[key: `--${string}`]: string;
	}

	type ExpandFacets<
		Facets extends Record<any, any>,
		TagName,
		ElementInterface extends HTMLElement | SVGElement =
			InterfaceFromTsDom<TagName>,
	> = Partial<
		AddPrefixToKeys<Facets['attributes'], PrefixIfDefined> &
			AddPrefixToKeys<Facets['properties'], PrefixProperty> &
			AddPrefixToKeys<
				FilterByContainedType<Facets['attributes'], boolean>,
				PrefixBoolean
			> &
			CustomSpecialAttributes<ElementInterface> &
			ElementChildrenAttribute &
			EventsPrefixed<Facets['events'], ElementInterface, PrefixEventListener> &
			Facets['attributes']
	>;

	type FilterByContainedType<Map, TypeToMatch> = {
		[Key in keyof Map as HasMatchingBranch<Map[Key], TypeToMatch> extends true
			? Key
			: never]: Map[Key];
	};

	type HasMatchingBranch<T, U> = [T & U] extends [never] ? false : true;

	type InterfaceFromTsDom<TagName> = TagName extends keyof HTMLElementTagNameMap
		? HTMLElementTagNameMap[TagName]
		: TagName extends keyof SVGElementTagNameMap
			? SVGElementTagNameMap[TagName]
			: HTMLElement | SVGElement;

	type LiteralFlavor = 'default' | 'server' | 'signal' | 'svg';

	type MappedIntrinsicElements<
		TagMap extends Record<any, any>,
		Base extends Record<any, any>,
	> = {
		[TagName in keyof TagMap]: ExpandFacets<Base, TagName> &
			ExpandFacets<Intrinsics.BaseElement, TagName> &
			ExpandFacets<TagMap[TagName], TagName>;
	};

	// type PrefixAttribute = 'attr:';
	type PrefixBoolean = 'bool:';
	type PrefixEventListener = 'on:';
	type PrefixIfDefined = 'if:';
	type PrefixProperty = '_:';

	interface Reference<CurrentElement = TemplateElement> {
		// readonly current?: CurrentElement | undefined; // Preact, React…
		readonly value?: CurrentElement | undefined; // Lit, Vue…
	}

	interface SpecialElements extends UseLiteralElements {
		'$:html': {
			/** Content */
			content: string;
		};
		'$:svg': {
			/** Content */
			content: string;
		};
		'for:each': ElementChildrenAttribute & {
			key: Key;
		};
	}

	interface StandardSpecialAttributes<ElementInterface> {
		'$:html'?: UnsafeContent;
		'$:svg'?: UnsafeContent;
		'each:key'?: Key;
		'use:ref'?: ReferenceOrCallback<ElementInterface>;
	}

	type SVGElementsWithoutConflicts = Omit<
		Intrinsics.BaseSVGElements,
		'a' | 'font' | 'image' | 'script' | 'style' | 'title' // TODO: Use a `svg:` tag namespace
	>;

	type TargetedEvent<
		Target extends EventTarget = EventTarget,
		TypedEvent extends Event = Event,
	> = Omit<TypedEvent, 'currentTarget'> & {
		readonly currentTarget: Target;
	};

	type UnsafeContent = null | string | symbol | undefined;

	type UseLiteralElements = {
		[key in `use:${LiteralFlavor}`]: ElementChildrenAttribute;
	};
}
