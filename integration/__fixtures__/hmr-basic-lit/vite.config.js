import { hmrPlugin, presets } from '@gracile-labs/hmr';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		hmrPlugin({
			include: ['src/**/*'],
			presets: [presets.lit],
		}),
	],
});
