'use html-signal';
import { For } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/for';
import { Show } from '@gracile-labs/vite-plugin-babel-jsx-to-literals/components/show';

import { TodoMvcStore, type AppOptions } from './todo-mvc.store.js';
import { computed } from '@lit-labs/signals';

export const Header = ({ store }: AppOptions) => (
	<header class="header">
		<h1>todos</h1>
		<input
			maxlength={5}
			class="new-todo"
			placeholder="What needs to be done?"
			on:keydown={(event) => {
				if (event.key !== 'Enter') return;
				store.addTodo(event.currentTarget.value.trim());
				event.currentTarget.value = '';
			}}
		/>
	</header>
);

export const ToggleAll = ({ store }: AppOptions) => (
	<>
		<input
			id="toggle-all"
			class="toggle-all"
			type="checkbox"
			prop:checked={!store.remainingCount}
			on:input={({ target: { checked } }) => store.toggleAll(checked)}
		/>
		<label for="toggle-all" />
	</>
);

export const TodoList = ({ store }: AppOptions) => (
	<ul class="todo-list">
		<For each={store.filteredTodos.get()} key={(todo) => todo.id}>
			{(todo) => (
				<li
					class:map={{
						todo: true,
						editing: store.editingTodoId.get() === todo.id,
						completed: todo.completed,
					}}
				>
					<div class="view">
						<input
							class="toggle"
							type="checkbox"
							prop:checked={todo.completed}
							on:input={(event) =>
								store.toggle(todo.id, event.currentTarget.checked)
							}
						/>

						<label on:dblclick={() => store.setEditing(todo.id)}>
							{todo.title}
						</label>
						<button
							class="destroy"
							on:click={() => store.removeTodo(todo.id)}
						></button>
					</div>

					<Show when={store.editingTodoId.get() === todo.id}>
						<input
							class="edit"
							value={todo.title}
							on:focusout={(event) =>
								store.save(todo.id, event.currentTarget.value.trim())
							}
							on:keyup={(event) => {
								if (event.key === 'Enter')
									store.save(todo.id, event.currentTarget.value.trim());
								else if (event.key === 'Escape') store.setEditing(null);
							}}
							ref={(ref) => {
								if (ref) queueMicrotask(() => ref.focus());
							}}
						/>
					</Show>
				</li>
			)}
		</For>
	</ul>
);

export const TodosFooter = ({ store }: AppOptions) => (
	<footer class="footer">
		<span class="todo-count">
			<strong>{store.remainingCount}</strong>
			{store.remainingCount.get() === 1 ? ' item ' : ' items '} left
		</span>

		<ul class="filters">
			<For each={TodoMvcStore.filters} key={(filter) => filter.slug}>
				{(filter) => (
					<li>
						<a
							href={`#/${filter.slug}`}
							class:map={{ selected: store.showMode.get() === filter.slug }}
						>
							{filter.title}
						</a>
					</li>
				)}
			</For>
		</ul>

		<Show when={store.remainingCount.get() !== store.todos.get().length}>
			<button class="clear-completed" on:click={() => store.clearCompleted()}>
				Clear completed
			</button>
		</Show>
	</footer>
);

export const Footer = () => (
	<footer class="info">
		<p>Double-click to edit a todo</p>
		<p>Created by Julian Cataldo</p>
		<p>
			Part of <a href="http://todomvc.com">TodoMVC</a>
		</p>
	</footer>
);

export const Main = ({ store }: AppOptions) => (
	<div>
		<section class="todoapp">
			<Header store={store} />

			<Show when={store.todos.get().length > 0}>
				<section class="main">
					<ToggleAll store={store} />
					<TodoList store={store} />
				</section>

				<TodosFooter store={store} />
			</Show>
		</section>

		<Footer />
	</div>
);
