// NOTE: Util. to pretty print for user provided server.

import { logger } from '@gracile/internal-utils/logger';
import { DEV } from 'esm-env';
import type { Server } from 'http';
import type { AddressInfo } from 'net';
import c from 'picocolors';

import { IP_EXPOSED } from './env.js';

export function printNodeHttpServerAddressInfos(instance: Server): AddressInfo {
	const infos = instance.address();
	logger.info(c.green(`${DEV ? 'development' : 'production'} server started`), {
		timestamp: true,
	});

	if (typeof infos === 'object' && infos && infos.port && infos.address) {
		logger.info(
			`
${c.dim('┃')} Local    ${c.cyan(`http://localhost:${infos.port}/`)}` +
				`${
					infos.address === IP_EXPOSED
						? `${c.dim('┃')} Network  ${c.cyan(`http://${infos.address}:${infos.port}/`)}`
						: ''
				}
`,
		);

		return infos;
	}

	throw Error('Invalid address/port.');
}
