import { render } from 'svelte/server';

import { defineIslandsFactory } from '../define.js';

export const defineSvelteIslands = defineIslandsFactory(
	(Component, properties) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		render(Component as any, { props: properties }).body,
);
