import './_internals/vite-logger.js';

import { readFile } from 'node:fs/promises';

import { setVersion } from '@gracile/internal-utils/version';

export { gracile } from '@gracile/engine/plugin';
export type { GracileConfig } from '@gracile/engine/user-config';

const { version } = JSON.parse(
	await readFile(new URL('../package.json', import.meta.url), 'utf8'),
) as {
	version: string;
};

setVersion(version);
