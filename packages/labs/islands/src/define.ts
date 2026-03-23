import type {
	Data,
	EligibleHost,
	RawRegistry,
	RenderOrHydrateFactory,
} from './types.js';

export function defineIslandsFactory(
	renderOrHydrateFactory: RenderOrHydrateFactory,
): (
	rawRegistry: RawRegistry,
) => Record<string, (properties: Data, host: EligibleHost) => void> {
	return (rawRegistry: RawRegistry) =>
		Object.fromEntries(
			Object.entries(rawRegistry).map(([name, Component]) => [
				name,
				(properties: Data, host: EligibleHost): void => {
					try {
						return renderOrHydrateFactory(Component, properties, host);
					} catch (error) {
						console.error('Failed to handle island', error);
					}
				},
			]),
		);
}
