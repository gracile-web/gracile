<script>
	let count = 0;
</script>

<div data-island="svelte">
	<h3>Island: Svelte</h3>
	<p class="island-status">Svelte SSR OK</p>
	<p>Count: {count}</p>
	<button on:click={() => (count += 1)}>+1</button>
</div>
