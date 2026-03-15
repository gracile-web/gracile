<script setup lang="ts">
import { ref } from 'vue';

let test: string = ref('test');

console.log('VUE');
</script>

<template>
	---
	<!--  -->
	<h2>VUE COUNTER2 11</h2>

	<!-- <button @click="console.log('VUEZ')">VUE GO</button> -->
	<button @click="test = Math.random().toString()">GO</button>
	{{ test }}

	<slot v-pre></slot>:SLOT
	<!--  -->
	---
</template>
