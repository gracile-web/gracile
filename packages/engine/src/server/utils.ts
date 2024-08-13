// NOTE: Util. to pretty print for user provided server.

import type { AddressInfo } from 'node:net';

import { env as currentEnv } from '@gracile/internal-utils/env';
import { logger } from '@gracile/internal-utils/logger';
import c from 'picocolors';

import { server as serverConstants } from './constants.js';

// setTimeout(() => {
// 	logger.info('HY');
// });

export function printAddressInfos(server: string | AddressInfo | null) {
	let address: null | string = null;
	if (!server) throw new Error('Incorrect address infos');
	if (typeof server === 'string') {
		address = server;
	} else {
		address = `http://${server.address}${server.port ? `:${String(server.port)}` : ''}`;
	}

	// NOTE: Might move this to internal util env
	const envs = {
		PROD: 'production',
		DEV: 'development',
		PREVIEW: 'preview',
		TEST: 'testing',
	};
	let env: keyof typeof envs = 'PROD';
	if (currentEnv.DEV) env = 'DEV';
	if (currentEnv.PREVIEW) env = 'PREVIEW';
	if (currentEnv.TEST) env = 'TEST';

	logger.info(c.green(`${envs[env]} ${c.yellow('server started')}`), {
		timestamp: true,
	});

	if (address.includes(serverConstants.IP_EXPOSED))
		logger.info(
			`${
				address.includes(serverConstants.IP_EXPOSED)
					? `\n${c.dim('┃')} Network  ${c.cyan(address)}\n`
					: ''
			}`,
		);
	else
		logger.info(
			`
${c.dim('┃')} Local    ${c.cyan(address.replace(/::1?/, 'localhost'))}\n`,
		);
}
