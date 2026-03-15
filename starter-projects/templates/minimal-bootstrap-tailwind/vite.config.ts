import { gracile } from '@gracile/gracile/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3030 },
	preview: { port: 3030 },

	plugins: [gracile()],
});
