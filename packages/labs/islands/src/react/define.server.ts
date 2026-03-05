import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { defineIslandsFactory } from '../define.js';

export const defineReactIslands = defineIslandsFactory(
	(Component, properties) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		renderToStaticMarkup(createElement(Component as any, properties)),
);
