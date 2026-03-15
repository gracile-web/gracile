<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
	<div data-island="vue">
		<h3>Island: Vue</h3>
		<p class="island-status">Vue SSR OK</p>
		<p>Count: {{ count }}</p>
		<button @click="count++">+1</button>
	</div>
</template>
