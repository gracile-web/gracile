import { defineConfig } from 'vite';
import { gracile } from '@gracile/gracile/plugin';

import { viteSvgPlugin } from '@gracile/svg/vite';
import { viteMarkdownPlugin } from '@gracile/markdown/vite';
import { MarkdownRenderer } from '@gracile/markdown-preset-marked';

export default defineConfig(({ command }) => {

	return {
		plugins: [
			gracile({
				routes: {
					exclude:
						command === 'build' ? ['**/throws.ts', '**/*-failure.ts'] : [],

					define: () => [
						{ pattern: '/programmatic/static-page', filePath: 'src/programmatic/prog-static.ts' },
						{ pattern: '/programmatic/param/:slug', filePath: 'src/programmatic/prog-param.ts' },
					],
				},

				pages: {
					premises: {
						expose: true,
						include: ['**/12-route-premises/**'], 
					},
				},
			}),
			viteSvgPlugin(),
			viteMarkdownPlugin({ MarkdownRenderer }),
		],
	};
});
