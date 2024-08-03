import { /* cp,  */ rm } from 'node:fs/promises';
import path from 'node:path';

import { logger } from '@gracile/internal-utils/logger';
import { build as viteBuild, createServer /* , type UserConfig */ } from 'vite';

// NOTE: This method is flaky (creating folders on the fly)
// import { defineConfig } from 'vite';
// import { gracile } from '@gracile/gracile/plugin';

// import { viteSvgPlugin } from '@gracile/svg/vite';
// import { viteMarkdownPlugin } from '@gracile/markdown/vite';
// import { MarkdownRenderer } from '@gracile/markdown-preset-marked';

//

// const configStatic = {
// 	plugins: [
// 		viteSvgPlugin(),
// 		viteMarkdownPlugin({ MarkdownRenderer }),
// 		gracile(),
// 	],
// } satisfies UserConfig;
// const configServer = {
// 	plugins: [
// 		viteSvgPlugin(),
// 		viteMarkdownPlugin({ MarkdownRenderer }),
// 		gracile({ mode: 'server' }),
// 	],
// } satisfies UserConfig;

// export const ERROR_HEADING = '😵 An error has occurred!';

await rm(path.join(process.cwd(), '.tmp'), { recursive: true }).catch(
	() => null,
);

export const ERROR_404 = `404 not found!`;

/* async  */ function getProjectTempPath(projectName: string) {
	const source = path.join(process.cwd(), '__fixtures__', projectName);

	// const temp = path.join(
	// 	process.cwd(),
	// 	'.tmp',
	// 	projectName,
	// 	crypto.randomUUID(),
	// );

	// await cp(source, temp, { recursive: true });

	// return temp;

	return source;
}

export async function createStaticDevServer({
	project,
	port,
	// mode = 'static',
}: {
	project: string;
	port: number;
	mode?: 'static' | 'server';
}) {
	logger.info('creating server…');
	if (!port) throw new Error('No port');

	const server = await createServer({
		// plugins: [
		// 	gracile({ mode }),
		// 	viteSvgPlugin(),
		// 	viteMarkdownPlugin({ MarkdownRenderer }),
		// ],
		// configFile: false,
		// mode,
		server: { port },
		root: /* await */ getProjectTempPath(project),
	});

	await server.listen();

	return { address: `http://localhost:${port}`, close: () => server.close() };
}

export async function build(project: string, _mode = 'static') {
	//
	return viteBuild({
		// configFile: false,

		// plugins: [
		// 	viteSvgPlugin(),
		// 	viteMarkdownPlugin({ MarkdownRenderer }),
		// 	gracile({ mode }),
		// ],
		// mode,

		root: /* await */ getProjectTempPath(project),
	});
}
