import { gracileHmr, presets } from '@gracile-labs/hmr';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		gracileHmr({
			include: ['src/**/*'],
			presets: [presets.lit],
		}),
	],
});
