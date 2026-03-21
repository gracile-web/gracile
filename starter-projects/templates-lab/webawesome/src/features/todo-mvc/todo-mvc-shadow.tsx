'use html-signal';
import { SignalWatcher } from '@lit-labs/signals';

import { css, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import todoMvcCss from 'todomvc-app-css/index.css?inline';
import { TodoMvcStore } from './todo-mvc.store.js';
import { Main } from './todo-mvc.components.jsx';

@customElement('todo-mvc')
export class TodoMvc extends SignalWatcher(LitElement) {
	@property({ type: Object, attribute: false }) store = new TodoMvcStore();

	public override render() {
		return <Main store={this.store} />;
	}

	static override styles = [
		css`
			:host {
				display: contents;
			}
		`,
		unsafeCSS(todoMvcCss.replaceAll('body {', ':host {')),
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'todo-mvc': TodoMvc;
	}
}
