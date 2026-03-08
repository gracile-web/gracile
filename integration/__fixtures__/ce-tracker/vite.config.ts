import { defineConfig } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

export default defineConfig({
	plugins: [gracile()],
});
