import { createElement, hydrate } from 'preact';

import { defineIslandsFactory } from '../define.js';

export const definePreactIslands = defineIslandsFactory(
	(Component, properties, host) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		hydrate(createElement(Component as any, properties), host),
);
