import path from 'node:path';

import { createStandaloneDevServer } from '@gracile/engine/dev/server';
import { RANDOM_PORT } from '@gracile/engine/server/env';
import { viteBuild } from '@gracile/engine/vite/build';
import { logger } from '@gracile/internal-utils/logger';

export const ERROR_HEADING = '😵 An error has occurred!';

function getProjectPath(projectName: string) {
	return path.join(process.cwd(), '__fixtures__', projectName);
}

export async function createServer(project: string, port?: number) {
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
