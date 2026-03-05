import { createSSRApp, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { defineIslandsFactory } from '../define.js';

export const defineVueIslands = defineIslandsFactory((Component, properties) =>
	renderToString(createSSRApp(Component as Component, properties)),
);
