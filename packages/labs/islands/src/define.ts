import type {
	Data,
	EligibleHost,
	RawRegistry,
	RenderOrHydrateFactory,
} from './types.js';

export function defineIslandsFactory(
	renderOrHydrateFactory: RenderOrHydrateFactory,
) {
	return (rawRegistry: RawRegistry) =>
		Object.fromEntries(
			Object.entries(rawRegistry).map(([name, Component]) => [
				name,
				(properties: Data, host: EligibleHost) => {
					try {
						return renderOrHydrateFactory(Component, properties, host);
					} catch (error) {
						console.error('Failed to handle island', error);
					}
				},
			]),
		);
}
