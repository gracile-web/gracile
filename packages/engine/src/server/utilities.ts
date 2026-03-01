// NOTE: Util. to pretty print for user provided server.

import type { AddressInfo } from 'node:net';

import { nodeCondition } from '@gracile/internal-utils/node-condition/production-ssr';
import { getLogger } from '@gracile/internal-utils/logger/helpers';
import c from 'picocolors';

import { constants } from './constants.js';

// setTimeout(() => {
// 	logger.info('HY');
// });

/**
 * Pretty print your server instance address as soon as it is listening.
 * Matches the dev. server CLI output style.
 * @param server - Takes an `node:net` `AddressInfo` like object (address, family, port) or just a provided, pre-constructed string.
 * @example
 *
 * ```js
 * import * as gracile from '@gracile/gracile/hono';
 * import { serve } from '@hono/node-server';
 *
 * // ...
 *
 * serve(
 * 	{ fetch: app.fetch, port: 3030, hostname: 'localhost' },
 * 	(address) => gracile.printUrls(address),
 * );
 * ```
 */
export function printUrls(server: string | AddressInfo | null) {
	const logger = getLogger();

	let address: null | string = null;
	if (!server) throw new Error('Incorrect address infos');
	address =
		typeof server === 'string'
			? server
			: `http://${server.address}${server.port ? `:${String(server.port)}` : ''}`;

	// NOTE: Might move this to internal util env
	const environments = {
		PROD: 'production',
		DEV: 'development',
		PREVIEW: 'preview',
		TEST: 'testing',
	};
	let environment: keyof typeof environments = 'PROD';
	if (nodeCondition.DEV) environment = 'DEV';
	if (nodeCondition.PREVIEW) environment = 'PREVIEW';
	if (nodeCondition.TEST) environment = 'TEST';

	logger.info(
		c.green(`${environments[environment]} ${c.yellow('server started')}`),
		{
			timestamp: true,
		},
	);

	if (address.includes(constants.IP_EXPOSED))
		logger.info(
			`${
				address.includes(constants.IP_EXPOSED)
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
