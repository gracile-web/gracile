import { createComponent, type Component } from 'solid-js';
import { hydrate } from 'solid-js/web';

import { defineIslandsFactory } from '../define.js';

export const defineSolidIslands = defineIslandsFactory(
	(Component, properties, host) =>
		hydrate(() => {
			return createComponent(Component as Component, properties);
		}, host),
);
