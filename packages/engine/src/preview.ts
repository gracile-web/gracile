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

	if (userConfigGracile?.output === 'server')
		throw new Error(
			c.red(
				`Vite preview is unnecessary when using the ${c.yellow('server mode')}.\n\n`,
			) +
				c.yellow(
					`You can use a \`preview\` script with this command:\n\n${c.white('node --env-file=.env --watch dist/server/server.js')}\n`,
				),
		);

	await vitePreview(port ?? userConfigGracile?.port ?? 9797, expose);
}
