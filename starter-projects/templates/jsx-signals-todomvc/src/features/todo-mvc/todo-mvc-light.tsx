'use html-signal';
import { computed } from '@lit-labs/signals';
import type { AppOptions } from './todo-mvc.store.js';
import { Main } from './todo-mvc.components.js';

export const TodoMvc = ({ store }: AppOptions) =>
	computed(() => <Main store={store}></Main>);

// NOTE: A top level `computed` is still needed here.
// In short, `SignalWatcher`. catches array changes, indirect signal usage (i.e
// via `.get` in control flows, attributes, etc.), but that's not the case yet
// when using signals in a light-dom rendered top level hydrated tree.
// Note that it's a nuclear hack, that will hopefully get fixed.
