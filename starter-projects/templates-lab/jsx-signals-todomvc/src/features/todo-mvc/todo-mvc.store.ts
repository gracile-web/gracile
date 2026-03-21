import { computed, signal } from '@lit-labs/signals';
import { isServer } from 'lit';

export type Todo = {
	id: string;
	title: string;
	completed: boolean;
};

export type Filter = 'all' | 'active' | 'completed';

export type AppOptions = { store: TodoMvcStore };

export class TodoMvcStore {
	constructor() {
		this.#attachEvents();
	}

	public static readonly filters = [
		{ title: 'All', slug: 'all' },
		{ title: 'Active', slug: 'active' },
		{ title: 'Completed', slug: 'completed' },
	];

	#todos = signal<Todo[]>([]);

	get todos() {
		return this.#todos;
	}

	#filteredTodos = computed(() =>
		this.todos.get().filter((todo) => {
			if (this.showMode.get() === 'all') return true;
			if (this.showMode.get() === 'active' && todo.completed === false)
				return true;
			if (this.showMode.get() === 'completed' && todo.completed) return true;
			return false;
		}),
	);

	get filteredTodos() {
		return this.#filteredTodos;
	}

	#editingTodoId = signal<null | string>(null);

	get editingTodoId() {
		return this.#editingTodoId;
	}

	#remainingCount = computed(
		() =>
			this.#todos.get().length -
			this.#todos.get().filter((todo) => todo.completed).length,
	);

	get remainingCount() {
		return this.#remainingCount;
	}

	#showMode = signal<Filter>('all');

	get showMode() {
		return this.#showMode;
	}

	setShowMode(mode: string) {
		if (mode === 'completed' || mode === 'active' || mode === 'all')
			this.#showMode.set(mode);
		else throw new Error('Incorrect filter.');
	}

	addTodo(title: string) {
		this.#todos.set([
			...this.#todos.get(),
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			{ title, id: this.#nanoid(3), completed: false },
		]);
	}

	removeTodo = (id: Todo['id']) => {
		this.#todos.set(this.#todos.get().filter((item) => item.id !== id));
	};

	editTodo = (edited: Partial<Todo> & { id: Todo['id'] }) => {
		this.#todos.set(
			this.#todos
				.get()
				.map((existing) =>
					existing.id === edited.id ? { ...existing, ...edited } : existing,
				),
		);
	};

	setEditing = (id: Todo['id'] | null) => {
		this.#editingTodoId.set(id || null);
	};

	save = (id: Todo['id'], title: string) => {
		if (this.#editingTodoId.get() === id) {
			this.editTodo({ id, title, completed: false });
			this.setEditing(null);
		}
	};

	toggle = (id: Todo['id'], completed: boolean) =>
		this.editTodo({ id, completed });

	toggleAll = (completed: boolean) => {
		this.#todos.set(
			this.#todos.get().map((todo) => ({
				...todo,
				completed,
			})),
		);
	};

	clearCompleted = () => {
		this.#todos.set(this.#todos.get().filter((t) => !t.completed));
	};

	#aborter = new AbortController();

	#attachEvents(): void {
		if (isServer) return;
		// NOTE: Refresh.
		this.#aborter.abort();
		this.#aborter = new AbortController();

		globalThis.window.addEventListener(
			'hashchange',
			() => this.setShowMode(globalThis.location.hash.slice(2)),
			{ signal: this.#aborter.signal },
		);
	}

	public detachEvents(): void {
		this.#aborter.abort();
	}

	#urlAlphabet =
		'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

	/* Copyright 2017 Andrey Sitnik <andrey@sitnik.ru> */
	#nanoid() {
		let id = '';
		let i = 21;
		// eslint-disable-next-line no-plusplus
		while (i--)
			// eslint-disable-next-line no-bitwise
			id += this.#urlAlphabet[(Math.random() * 64) | 0];
		return id;
	}
}
