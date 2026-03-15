<script>
	let count = 0;

	function handleClick() {
		count += 1;
	}
</script>

<h2>SVELTE_ _COUNTER 11</h2>

<button on:click={handleClick}>
	clicks: {count}
</button>
