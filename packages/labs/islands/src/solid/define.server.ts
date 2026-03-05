import { renderToString } from 'solid-js/web';
import { createComponent, type Component } from 'solid-js';

import { defineIslandsFactory } from '../define.js';

// NOTE: User has to put the hydration scripts in document head, e.g.:
// import { generateHydrationScript } from 'solid-js/web';
// 	<head>
// 				${unsafeHTML(generateHydrationScript())}

export const defineSolidIslands = defineIslandsFactory(
	(Component, properties) =>
		renderToString(() => createComponent(Component as Component, properties)),
);
