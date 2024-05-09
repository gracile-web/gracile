import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';

import { getConfigs } from '../vite/config.js';
import { startServer } from './server.js';

const DEFAULT_DEV_SERVER_PORT = 9090;

export async function dev(options: {
	port?: number | undefined;
	root?: string;
	expose?: boolean | undefined;
}) {
	logger.info(c.gray('\n— Development mode —\n'));

	const { userConfigGracile } = await getConfigs(
		options.root ?? process.cwd(),
		'dev',
	);

	const port =
		options.port ?? userConfigGracile?.port ?? DEFAULT_DEV_SERVER_PORT;

	startServer({
		...options,
		port,
	}).catch((e) => logger.error(String(e)));
}
