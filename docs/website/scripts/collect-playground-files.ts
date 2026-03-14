import { readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import glob from 'fast-glob';
import type { FileSystemTree } from '@webcontainer/api';
import set from 'lodash.set';

const files: FileSystemTree = {
	'package.json': {
		file: {
			contents: JSON.stringify({
				name: 'gracile-playground',
				private: true,
				type: 'module',
				scripts: {
					dev: 'gracile-dev',
				},
				dependencies: {
					lit: 'latest',
					'@lit-labs/ssr': 'latest',
					'@lit-labs/ssr-client': 'latest',
					'fast-glob': 'latest',
					'@gracile/gracile': 'workspace:^',
					'@gracile/server': 'workspace:^',
					'@gracile/client': 'workspace:^',
					'@gracile/metadata': 'workspace:^',
					'@gracile/markdown': 'workspace:^',
				},
				devDependencies: {
					// vite: '^5',
				},
			}),
		},
	},

	'gracile.config.js': {
		file: {
			contents: `
import { defineConfig } from '@gracile/gracile';
// import { vitePluginMarkdownLit } from '@gracile/markdown/vite';

export default defineConfig({
  // ...

  vite: {
  //  plugins: [vitePluginMarkdownLit()],
  },
});      
`,
		},
	},

	src: {
		directory: {
			'document.ts': {
				file: {
					contents: `
import { html } from '@lit-labs/ssr';
import { helpers } from '@gracile/server/document';

export const document = (options: { url: URL; title?: string }) =>
  html\`<!doctype html>
    <html lang="en">
      <head>
        <!-- Helpers -->
        \${helpers.fullHydration}
      </head>

      <body>
        <route-template-outlet></route-template-outlet>
      </body>
    </html> \`;
`,
				},
			},

			routes: {
				directory: {
					'index.ts': {
						file: {
							contents: `
import { html } from 'lit';
import { defineRoute } from '@gracile/server/route';
import { document } from '../document.js';

// console.log({ mainReadme });

export default defineRoute({
  document: (context) => document(context),

  template: () => html\`
    <!--  -->

    <h1>Welcome the Gracile demo!</h1>
  \`,
});
              
    `,
						},
					},
				},
			},
		},
	},

	'pnpm-workspace.yaml': {
		file: {
			contents: `packages:
  - lib/**/*
  - .
`,
		},
	},

	foo: {
		directory: {
			test: {
				file: {
					contents: 'hey',
				},
			},
		},
	},
};

const gracileFiles = await glob(
	join(process.cwd(), '../../packages/**/*.{js,json}'),
	{ ignore: [join(process.cwd(), '../../packages/**/node_modules/**')] },
);

await Promise.all(
	gracileFiles.map(async (filePath) => {
		set(
			files,
			join('lib', relative(join(process.cwd(), '../..'), filePath))
				.replaceAll('/', '/directory/')
				.split('/'),
			{ file: { contents: await readFile(filePath, 'utf8') } },
		);
	}),
);

await writeFile(
	'./public/playground-data.json',
	JSON.stringify(files, null, 2),
);
