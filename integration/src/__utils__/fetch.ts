import { join } from 'node:path';

import { logger } from '@gracile/internal-utils/logger';

export async function fetchResource(
	base: string,
	urlParts: string[],
	options?: {
		trailingSlash?: boolean;
	},
) {
	const pathname =
		join(...urlParts) + (options?.trailingSlash === false ? '' : '/');

	const url = new URL(pathname, base);

	// console.log(urlParts);
	logger.info(`Fetching \`${url.toString()}\`…`);
	const result = await fetch(url).then((r) => r.text());

	// console.log({ result });
	return result;
}
