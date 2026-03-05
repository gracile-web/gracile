import { createElement } from 'preact';
import { renderToString } from 'preact-render-to-string';

import { defineIslandsFactory } from '../define.js';

export const definePreactIslands = defineIslandsFactory(
	(Component, properties) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		renderToString(createElement(Component as any, properties)),
);
