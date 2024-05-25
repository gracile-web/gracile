import { defineConfig } from '@gracile/gracile';

export default defineConfig({
	output: 'server',

	vite: {
		build: {
			target: 'esnext',
		},
	},
});
