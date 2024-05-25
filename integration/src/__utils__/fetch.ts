import { join } from 'node:path';

import { logger } from '@gracile/internal-utils/logger';

export async function fetchResource(
	urlParts: string[],
	options?: {
		trailingSlash?: boolean;
	},
) {
	const url = join(...urlParts) + (options?.trailingSlash === false ? '' : '/');
	logger.info(`Fetching \`${url}\`…`);
	const result = await fetch(url).then((r) => r.text());
	return result;
}
