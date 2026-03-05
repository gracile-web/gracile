import { createSSRApp, type Component } from 'vue';

import { defineIslandsFactory } from '../define.js';

export const defineVueIslands = defineIslandsFactory(
	(Component, properties, host) => {
		const app = createSSRApp(Component as Component, properties);
		app.mount(host as Element);
	},
);
