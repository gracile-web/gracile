import { gracile } from '@gracile/gracile/plugin';
import { hmrPlugin, presets } from '@gracile-labs/hmr';
import { defineConfig } from 'vite';

export default defineConfig({
	server: { port: 3030 },
	preview: { port: 3030 },

	plugins: [
		gracile(),
		hmrPlugin({
			include: ['src/**/*.ts'],
			presets: [presets.lit],
		}),
	],
});
