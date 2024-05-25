import path from 'node:path';

import { dev } from '@gracile/engine/dev/dev';
import { createStandaloneDevServer } from '@gracile/engine/dev/server';
import { RANDOM_PORT } from '@gracile/engine/server/env';
import { viteBuild } from '@gracile/engine/vite/build';
import { logger } from '@gracile/internal-utils/logger';

export const ERROR_HEADING = '😵 An error has occurred!';

function getProjectPath(projectName: string) {
	return path.join(process.cwd(), '__fixtures__', projectName);
}

export async function createDynamicDevServer({
	project,
	port,
}: {
	project: string;
	port?: number;
}) {
	/* const devServer =  */ await dev({ root: getProjectPath(project), port });

	return {
		close: async () => {
			await fetch('http://localhost:3033/__close');

			// await devServer.close();
		},
	};
}

export async function createStaticDevServer({
	project,
	port,
}: {
	project: string;
	port?: number;
}) {
	// NOTE: Should just use dev, like `createDynamicDevServer` does
	const { port: foundPort, instance } = await createStandaloneDevServer({
		port: typeof port !== 'undefined' ? port : RANDOM_PORT,
		root: getProjectPath(project),
	});

	async function close(code = 0) {
		logger.info('closing server…');

		return new Promise((resolve) => {
			instance.close(() => {
				resolve('server closed');
				process.exit(code);
			});
		});
	}

	async function tryOrClose(fn: () => Promise<void> | void) {
		try {
			await Promise.resolve(fn());
		} catch (e) {
			logger.error(String(String(e)));
			await close(1);
		}
	}

	return {
		port: foundPort,
		address: `http://localhost:${foundPort}`,
		close,
		tryOrClose,
	};
}

export async function build(project: string) {
	await viteBuild(getProjectPath(project));
}
