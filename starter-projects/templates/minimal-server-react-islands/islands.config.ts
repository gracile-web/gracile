/* TODO: test: @\refresh reload */
/* eslint-disable simple-import-sort/imports */
import { defineSvelteIslands } from '@gracile-labs/islands/svelte/define';
import { defineSolidIslands } from '@gracile-labs/islands/solid/define';
import { defineVueIslands } from '@gracile-labs/islands/vue/define';
import { defineReactIslands } from '@gracile-labs/islands/react/define';
import { definePreactIslands } from '@gracile-labs/islands/preact/define';
// import { definePreactIslands } from 'test:aaa';

import CounterVue from './src/islands/Counter.vue';
import CounterSvelte from './src/islands/Counter.svelte';
import CounterSolid from './src/islands/Counter.solid.jsx';
import CounterPreact from './src/islands/Counter.preact.jsx';
import CounterReact from './src/islands/Counter.react.jsx';

export default {
	...defineVueIslands({
		CounterVue,
	}),
	...defineReactIslands({
		CounterReact,
	}),
	...definePreactIslands({
		CounterPreact,
	}),
	...defineSvelteIslands({
		CounterSvelte,
	}),
	...defineSolidIslands({
		CounterSolid,
	}),
};

export const v = () => `ccccccccccccc`;
