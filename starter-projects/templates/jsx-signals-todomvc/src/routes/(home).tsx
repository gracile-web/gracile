'use html-signal';
import { defineRoute } from '@gracile/gracile/route';

import '../features/todo-mvc/todo-mvc-shadow.js';

import { TodoMvcStore } from '../features/todo-mvc/todo-mvc.store.js';
import { TodoMvc } from '../features/todo-mvc/todo-mvc-light.js';
import { document } from '../document.js';
import '../features/title-element.element.js';

const store = new TodoMvcStore();

export default defineRoute({
	document: () => document({ title: 'Gracile - TodoMVC' }),

	template: () => (
		<main>
			<span>Light</span>

			<hr />

			<TodoMvc store={store} />

			<span>Shadow</span>
			<hr />

			<div bool:hidden={true}>Hello</div>

			<todo-mvc prop:store={store} />

			<div class:list={[true && 'test', store.todos.get().length < 1 && 'NO']}>
				AAAAAAAAAAAAAAAAA
			</div>

			<title-element
				class:list={[true && 'test', store.todos.get().length < 1 && 'NO']}
				on:click={(e) => {
					e.currentTarget.someProp;
				}}
				on:update={(event) => {
					event?.currentTarget;
				}}
			></title-element>

			{/* {html`
      			<title-element
				 
			></title-element>
      `} */}
		</main>
	),
});
