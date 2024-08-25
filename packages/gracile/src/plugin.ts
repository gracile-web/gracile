import './_internals/vite-logger.js';

import { setVersion } from '@gracile/internal-utils/version';
import { readFile } from 'fs/promises';

export { gracile } from '@gracile/engine/plugin';
export type { GracileConfig } from '@gracile/engine/user-config';

const { version } = JSON.parse(
	await readFile(new URL('../package.json', import.meta.url), 'utf-8'),
) as {
	version: string;
};

setVersion(version);
