import { defineConfig } from '@gracile/gracile';
import { viteSvgPlugin } from '@gracile/svg/vite';
import { viteMarkdownPlugin } from '@gracile/markdown/vite';
import { MarkdownRenderer } from '@gracile/markdown-preset-marked';

export default defineConfig({
	vite: {
		plugins: [
			//
			viteSvgPlugin(),
			viteMarkdownPlugin({ MarkdownRenderer }),
		],
	},
});
