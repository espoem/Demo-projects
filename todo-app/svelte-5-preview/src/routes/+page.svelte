<script lang="ts">
	type Todo = {
		id: string;
		text: string;
		done: boolean;
	};
	type Filter = 'all' | 'active' | 'completed';

	let todos = $state<Todo[]>([]);
	let filter = $state<Filter>('all');
	let filteredTodos = $derived(filterTodos());

	$effect(() => {
		const savedTodos = localStorage.getItem('todos');
		savedTodos && (todos = JSON.parse(savedTodos));
	});

	$effect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
	});

	function filterTodos() {
		switch (filter) {
			case 'all':
				return todos;
			case 'active':
				return todos.filter((todo) => !todo.done);
			case 'completed':
				return todos.filter((todo) => todo.done);
		}
	}

	function addTodo(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;

		const todoEl = event.target as HTMLInputElement;
		const id = window.crypto.randomUUID();
		const text = todoEl.value;
		const done = false;
		todos = [...todos, { id, text, done }];
		todoEl.value = '';
	}

	function editTodo(event: Event) {
		const elem = event.target as HTMLInputElement;
		const todo = todos.find((todo) => todo.id === elem.dataset.id);
		if (!todo) return;
		todo.text = elem.value;
	}

	function toggleTodo(event: Event) {
		const elem = event.target as HTMLInputElement;
		const todo = todos.find((todo) => todo.id === elem.dataset.id);
		if (!todo) return;
		todo.done = !todo.done;
	}

	function deleteTodo(event: Event) {
		const elem = event.target as HTMLInputElement;
		const todo = todos.find((todo) => todo.id === elem.dataset.id);
		if (!todo) return;
		todos = todos.filter((todo) => todo.id !== elem.dataset.id);
	}

	function remaining() {
		return todos.filter((todo) => !todo.done).length;
	}

	$inspect(filteredTodos);
	$inspect(filter);
</script>

<input onkeydown={addTodo} placeholder="Add todo" type="text" name="" id="" />

<div class="todos">
	{#each filteredTodos as todo, i (todo.id)}
		<div class:completed={todo.done} class="todo">
			<input oninput={editTodo} data-index={i} data-id={todo.id} value={todo.text} type="text" />
			<!-- <input bind:value={todo.text} type="text" /> -->
			<input
				onchange={toggleTodo}
				data-index={i}
				data-id={todo.id}
				checked={todo.done}
				type="checkbox"
			/>
			<!-- <input bind:checked={todo.done} type="checkbox" /> -->
			<i class="gg-close delete" onclick={deleteTodo} data-index={i} data-id={todo.id}></i>
		</div>
	{/each}
</div>

<div class="filters">
	<button onclick={() => (filter = 'all')}>All</button>
	<button onclick={() => (filter = 'active')}>Active</button>
	<button onclick={() => (filter = 'completed')}>Completed</button>
</div>

<p>{remaining()} items left</p>

<style>
	@import url('https://unpkg.com/css.gg@2.0.0/icons/css/close.css');

	.todos {
		display: grid;
		gap: 1rem;
		margin-block-start: 1rem;
	}

	.todo {
		position: relative;
		transition: opacity 0.3s;
	}

	.completed {
		opacity: 0.4;
	}

	input[type='text'] {
		width: 100%;
		padding: 1rem;
	}

	input[type='checkbox'] {
		position: absolute;
		right: 4%;
		top: 50%;
		transform: translateY(-50%);
	}

	.delete {
		position: absolute;
		right: 0%;
		top: 50%;
		transform: translate(150%, -50%);
		cursor: pointer;
		color: var(--red-9);
	}

	.filters {
		margin-block: 1rem;
	}
</style>
