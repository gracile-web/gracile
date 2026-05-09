import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { defineIslandsFactory } from '../define.js';

export const defineReactIslands = defineIslandsFactory(
	(Component, properties) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		renderToString(createElement(Component as any, properties)),
);
