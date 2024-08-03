import { defineConfig } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

import { viteSvgPlugin } from '@gracile/svg/vite';
import { viteMarkdownPlugin } from '@gracile/markdown/vite';
import { MarkdownRenderer } from '@gracile/markdown-preset-marked';

export default defineConfig({
	plugins: [
		gracile({ mode: 'server' }),
		// TODO: Test addons with server
		viteSvgPlugin(),
		viteMarkdownPlugin({ MarkdownRenderer }),
	],
	build: {
		target: 'esnext',
	},
});
