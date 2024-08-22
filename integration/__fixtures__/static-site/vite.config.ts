import { defineConfig } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

import { viteSvgPlugin } from '@gracile/svg/vite';
import { viteMarkdownPlugin } from '@gracile/markdown/vite';
import { MarkdownRenderer } from '@gracile/markdown-preset-marked';

export default defineConfig(({ command }) => {
	console.log({ command });
	return {
		plugins: [
			gracile({
				routes: {
					exclude:
						command === 'build' ? ['**/throws.ts', '**/*-failure.ts'] : [],
				},

				pages: {
					premises: {
						expose: true,
						include: ['**/12-route-premises/**'],
						// exclude: ['**/**'],
					},
				},
			}),
			viteSvgPlugin(),
			viteMarkdownPlugin({ MarkdownRenderer }),
		],
	};
});
