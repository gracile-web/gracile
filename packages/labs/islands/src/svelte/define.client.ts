import { hydrate } from 'svelte';

import { defineIslandsFactory } from '../define.js';

export const defineSvelteIslands = defineIslandsFactory(
	(Component, properties, host) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		hydrate(Component as any, {
			target: host,
			props: properties,
		}),
);
