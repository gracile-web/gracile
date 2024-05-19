import { logger } from '@gracile/internal-utils/logger';
import { setCurrentWorkingDirectory } from '@gracile/internal-utils/paths';
import c from 'picocolors';

import { getConfigs } from '../vite/config.js';
import {
	DEFAULT_DEV_SERVER_PORT,
	DEFAULT_USER_SERVER_MODULE_ENTRYPOINT,
	startServer,
	startUserProvidedServer,
} from './server.js';

export async function dev(options: {
	port?: number | undefined;
	root?: string;
	expose?: boolean | undefined;
}) {
	logger.info(c.gray('\n— Development mode —\n'));

	const root = setCurrentWorkingDirectory(options.root);

	const { userConfigGracile } = await getConfigs(root, 'dev');
	const port =
		options.port ?? userConfigGracile?.port ?? DEFAULT_DEV_SERVER_PORT;

	const entrypoint =
		userConfigGracile?.server?.entrypoint ??
		DEFAULT_USER_SERVER_MODULE_ENTRYPOINT;

	if (userConfigGracile?.output === 'server') {
		startUserProvidedServer({
			root,
			entrypoint,
		}).catch((e) => logger.error(String(e)));
	} else {
		startServer({ root, port }).catch((e) => logger.error(String(e)));
	}
}
