<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
	<div>
		<h3>Vue Counter</h3>
		<p>Count: {{ count }}</p>
		<button @click="count++">Increment</button>
		<button @click="count = 0">Reset</button>
	</div>
</template>
