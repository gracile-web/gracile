import { defineReactIslands } from '@gracile-labs/islands/react/define';
import { defineVueIslands } from '@gracile-labs/islands/vue/define';
import { defineSvelteIslands } from '@gracile-labs/islands/svelte/define';
import { defineSolidIslands } from '@gracile-labs/islands/solid/define';
import { definePreactIslands } from '@gracile-labs/islands/preact/define';

import CounterReact from './src/islands/Counter.react.js';
import CounterVue from './src/islands/Counter.vue';
// @ts-expect-error No declaration
import CounterSvelte from './src/islands/Counter.svelte';
import CounterSolid from './src/islands/Counter.solid.js';
import CounterPreact from './src/islands/Counter.preact.js';

export default {
	...defineReactIslands({ CounterReact }),
	...defineVueIslands({ CounterVue }),
	...defineSvelteIslands({ CounterSvelte }),
	...defineSolidIslands({ CounterSolid }),
	...definePreactIslands({ CounterPreact }),
};
