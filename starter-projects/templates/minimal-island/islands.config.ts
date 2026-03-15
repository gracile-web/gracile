import { defineReactIslands } from '@gracile-labs/islands/react/define';
import { defineVueIslands } from '@gracile-labs/islands/vue/define';

import CounterReact from './src/islands/Counter.react.js';
import CounterVue from './src/islands/Counter.vue';

export default {
	...defineReactIslands({ CounterReact }),
	...defineVueIslands({ CounterVue }),
};
