import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { defineIslandsFactory } from '../define.js';

export const defineReactIslands = defineIslandsFactory(
	(Component, properties, host) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		hydrateRoot(host as Element, createElement(Component as any, properties)),
);
