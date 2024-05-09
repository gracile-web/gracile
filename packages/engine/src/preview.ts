import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';

import { getConfigs } from './vite/config.js';
import { vitePreview } from './vite/server.js';

export async function preview({
	port,
	expose,
	root,
}: {
	port?: number | undefined;
	expose?: boolean | undefined;
	root?: string;
}) {
	logger.info(c.gray('\n— Preview mode —\n'));

	const { userConfigGracile } = await getConfigs(
		root ?? process.cwd(),
		'build',
	);

	await vitePreview(port ?? userConfigGracile?.port ?? 9797, expose);
}
