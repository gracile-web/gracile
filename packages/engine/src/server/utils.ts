// NOTE: Util. to pretty print for user provided server.

import type { AddressInfo } from 'node:net';

import { logger } from '@gracile/internal-utils/logger';
import { DEV } from 'esm-env';
import c from 'picocolors';

import { IP_EXPOSED } from './env.js';

export function printAddressInfos(server: string | AddressInfo | null) {
	let address: null | string = null;
	if (!server) throw new Error('Incorrect address infos');
	if (typeof server === 'string') {
		address = server;
	} else {
		address = `http://${server.address}${server.port ? `:${String(server.port)}` : ''}`;
	}

	logger.info(c.green(`${DEV ? 'development' : 'production'} server started`), {
		timestamp: true,
	});

	if (address.includes(IP_EXPOSED))
		logger.info(
			`${
				address.includes(IP_EXPOSED)
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
