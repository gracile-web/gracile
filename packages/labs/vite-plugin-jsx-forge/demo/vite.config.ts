import { gracile } from '@gracile/gracile/plugin';
import { gracileJsxTs } from '../dist/to-literals';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3040 },
	preview: { port: 3040 },

	plugins: [gracileJsxTs(), gracile()],
});
