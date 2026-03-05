export declare function HydrateOrRender(properties: Data | undefined): string;
export declare function HydrateOrRender(
	properties: Data | undefined,
	host: EligibleHost,
): void;

export type IslandRegistry = {
	islands: Record<string, typeof HydrateOrRender>;
};

export type RenderOrHydrateFactory = (
	Component: unknown,
	properties: Data,
	host: EligibleHost,
) => void;

export type RawRegistry = { [key: string]: unknown };

export const TAG_NAME = 'is-land';

export type Data = Record<string, unknown>;

export type EligibleHost = HTMLElement | ShadowRoot;
